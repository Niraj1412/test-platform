import type { ResponseData } from '@quizforge/shared'
import { QuestionDataSchema, ResponseDataSchema } from '@quizforge/shared'
import { AttemptStatus, TestStatus } from '@prisma/client'
import type { Request } from 'express'
import { prisma } from '../lib/prisma.js'
import { safeRedis } from '../lib/redis.js'
import { gradingService } from './grading.service.js'
import { AppError } from '../utils/appError.js'
import { sanitiseQuestionForTaker } from '../utils/questionSanitiser.js'

interface GuestData {
  name: string
  email: string
  guestSessionId: string
}

const shuffle = <T>(items: T[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swapIndex] as T
    copy[swapIndex] = current as T
  }
  return copy
}

const assertAvailable = (test: { status: TestStatus; startsAt: Date | null; endsAt: Date | null }) => {
  const now = new Date()
  if (test.status !== TestStatus.PUBLISHED) {
    throw new AppError(404, 'TEST_NOT_AVAILABLE', 'Test is not available')
  }
  if (test.startsAt && test.startsAt > now) {
    throw new AppError(403, 'TEST_NOT_STARTED', 'Test window has not started')
  }
  if (test.endsAt && test.endsAt < now) {
    throw new AppError(403, 'TEST_CLOSED', 'Test window has ended')
  }
}

const assignmentTtl = (test: { globalDurationMins: number | null; endsAt: Date | null }) => {
  const durationSeconds = (test.globalDurationMins ?? 24 * 60) * 60
  if (!test.endsAt) {
    return durationSeconds
  }
  const untilEnd = Math.floor((test.endsAt.getTime() - Date.now()) / 1000)
  return Math.max(60, Math.min(durationSeconds, untilEnd))
}

const getAssignedIds = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === 'string')
}

const ownerFilter = (attemptId: string, caller: Request['user']) => {
  if (caller.role === 'GUEST') {
    return { id: attemptId, guestSessionId: caller.guestSessionId }
  }
  return { id: attemptId, takerId: caller.id }
}

export class AttemptService {
  async joinTest(accessCode: string) {
    const test = await prisma.test.findUnique({
      where: { accessCode },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { questions: { orderBy: { order: 'asc' } } }
        }
      }
    })

    if (!test) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }
    assertAvailable(test)

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      instructions: test.instructions,
      globalDurationMins: test.globalDurationMins,
      timingMode: test.timingMode,
      requireFullscreen: test.requireFullscreen,
      sections: test.sections.map((section) => ({
        id: section.id,
        title: section.title,
        instructions: section.instructions,
        order: section.order,
        durationMins: section.durationMins,
        questionsToDisplay: section.questionsToDisplay || section.questions.length,
        questionCount: section.questions.length,
        questions: section.questions.map((question) =>
          sanitiseQuestionForTaker({
            ...question,
            questionData: QuestionDataSchema.parse(question.questionData)
          })
        )
      }))
    }
  }

  async startAttempt(testId: string, takerId: string | null, guestData: GuestData | null) {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { questions: { orderBy: { order: 'asc' } } }
        }
      }
    })

    if (!test) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }
    assertAvailable(test)

    const countWhere = takerId
      ? { testId, takerId }
      : { testId, guestEmail: guestData?.email ?? undefined }
    const existingCount = await prisma.attempt.count({ where: countWhere })
    if (!test.allowMultipleAttempts && existingCount > 0) {
      throw new AppError(409, 'ATTEMPT_LIMIT_REACHED', 'Multiple attempts are not allowed for this test')
    }
    if (test.allowMultipleAttempts && existingCount >= test.maxAttempts) {
      throw new AppError(409, 'ATTEMPT_LIMIT_REACHED', 'Maximum attempts reached')
    }

    const assignedQuestions = test.sections.flatMap((section) => {
      const ordered = section.shuffleQuestions || test.shuffleQuestions ? shuffle(section.questions) : section.questions
      const count =
        section.questionsToDisplay > 0 && section.questionsToDisplay < ordered.length
          ? section.questionsToDisplay
          : ordered.length
      return ordered.slice(0, count)
    })

    const attempt = await prisma.attempt.create({
      data: {
        testId,
        takerId,
        guestName: guestData?.name,
        guestEmail: guestData?.email,
        guestSessionId: guestData?.guestSessionId,
        assignedQuestions: assignedQuestions.map((question) => question.id)
      }
    })

    const payload = {
      ...attempt,
      questions: assignedQuestions.map((question) =>
        sanitiseQuestionForTaker({
          ...question,
          questionData: QuestionDataSchema.parse(question.questionData)
        })
      )
    }
    await safeRedis.set(`attempt:${attempt.id}:state`, JSON.stringify(payload), assignmentTtl(test))
    return payload
  }

  async saveAnswer(
    attemptId: string,
    caller: Request['user'],
    questionId: string,
    responseData: unknown,
    isFlagged: boolean
  ) {
    const attempt = await prisma.attempt.findFirst({
      where: ownerFilter(attemptId, caller),
      select: { id: true, status: true, assignedQuestions: true }
    })

    if (!attempt) {
      throw new AppError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found')
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new AppError(409, 'ATTEMPT_NOT_ACTIVE', 'Attempt is not in progress')
    }
    const assignedIds = getAssignedIds(attempt.assignedQuestions)
    if (assignedIds.length > 0 && !assignedIds.includes(questionId)) {
      throw new AppError(403, 'QUESTION_NOT_ASSIGNED', 'Question was not assigned to this attempt')
    }

    const parsed = ResponseDataSchema.parse(responseData)
    await prisma.$transaction([
      prisma.answer.upsert({
        where: { attemptId_questionId: { attemptId, questionId } },
        update: { responseData: parsed, isFlagged },
        create: { attemptId, questionId, responseData: parsed, isFlagged }
      }),
      prisma.attempt.update({
        where: { id: attemptId },
        data: { lastSavedAt: new Date() }
      })
    ])

    await safeRedis.set(
      `attempt:${attemptId}:answer:${questionId}`,
      JSON.stringify({ responseData: parsed, isFlagged, savedAt: new Date().toISOString() }),
      24 * 60 * 60
    )
  }

  async submitAttempt(attemptId: string, caller: Request['user']) {
    const attempt = await prisma.attempt.findFirst({
      where: ownerFilter(attemptId, caller),
      select: { id: true, status: true }
    })
    if (!attempt) {
      throw new AppError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found')
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new AppError(409, 'ATTEMPT_NOT_ACTIVE', 'Attempt is not in progress')
    }

    await prisma.attempt.update({
      where: { id: attemptId },
      data: { status: AttemptStatus.SUBMITTED, submittedAt: new Date() }
    })
    await gradingService.gradeAttempt(attemptId)
    await safeRedis.del(`attempt:${attemptId}:state`)

    return prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        status: true,
        rawScore: true,
        totalMarks: true,
        percentage: true,
        passed: true,
        submittedAt: true
      }
    })
  }

  async resumeAttempt(attemptId: string, caller: Request['user']) {
    const cached = await safeRedis.get(`attempt:${attemptId}:state`)
    const attempt = await prisma.attempt.findFirst({
      where: ownerFilter(attemptId, caller),
      include: {
        test: true,
        answers: true
      }
    })

    if (!attempt) {
      throw new AppError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found')
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new AppError(409, 'ATTEMPT_NOT_ACTIVE', 'Attempt is not in progress')
    }
    assertAvailable(attempt.test)

    if (cached) {
      return JSON.parse(cached) as unknown
    }

    return {
      id: attempt.id,
      testId: attempt.testId,
      startedAt: attempt.startedAt,
      lastSavedAt: attempt.lastSavedAt,
      assignedQuestions: getAssignedIds(attempt.assignedQuestions),
      sectionTimings: attempt.sectionTimings,
      answers: attempt.answers.map((answer) => ({
        questionId: answer.questionId,
        responseData: answer.responseData as ResponseData,
        isFlagged: answer.isFlagged
      }))
    }
  }

  async getAttempt(attemptId: string, caller: Request['user']) {
    const attempt = await prisma.attempt.findFirst({
      where: ownerFilter(attemptId, caller),
      include: {
        test: {
          include: {
            sections: {
              include: {
                questions: true
              }
            }
          }
        },
        answers: true
      }
    })

    if (!attempt) {
      throw new AppError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found')
    }

    return attempt
  }
}

export const attemptService = new AttemptService()
