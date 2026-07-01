import type { CreateTestInput, UpdateTestInput } from '@quizforge/shared'
import { Prisma, TestStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'
import { generateAccessCode } from '../utils/accessCode.js'
import { sanitiseHtml } from '../utils/html.js'
import { QuestionDataSchema } from '@quizforge/shared'
import { sanitiseQuestionForTaker } from '../utils/questionSanitiser.js'

const creatorTestSelect = {
  id: true,
  creatorId: true,
  title: true,
  description: true,
  instructions: true,
  status: true,
  accessCode: true,
  accessLink: true,
  totalMarks: true,
  passingScore: true,
  negativeMarkingGlobal: true,
  timingMode: true,
  globalDurationMins: true,
  startsAt: true,
  endsAt: true,
  allowMultipleAttempts: true,
  maxAttempts: true,
  showResultsInstantly: true,
  showCorrectAnswers: true,
  allowSectionBacktrack: true,
  shuffleQuestions: true,
  requireFullscreen: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.TestSelect

const testWithSections = {
  ...creatorTestSelect,
  sections: {
    orderBy: { order: 'asc' as const },
    include: {
      questions: {
        orderBy: { order: 'asc' as const }
      }
    }
  }
} satisfies Prisma.TestSelect

export class TestService {
  async createTest(creatorId: string, data: CreateTestInput) {
    return prisma.test.create({
      data: {
        creatorId,
        title: data.title,
        description: sanitiseHtml(data.description),
        instructions: sanitiseHtml(data.instructions),
        passingScore: data.passingScore,
        negativeMarkingGlobal: data.negativeMarkingGlobal,
        timingMode: data.timingMode,
        globalDurationMins: data.globalDurationMins,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        allowMultipleAttempts: data.allowMultipleAttempts,
        maxAttempts: data.maxAttempts,
        showResultsInstantly: data.showResultsInstantly,
        showCorrectAnswers: data.showCorrectAnswers,
        allowSectionBacktrack: data.allowSectionBacktrack,
        shuffleQuestions: data.shuffleQuestions,
        requireFullscreen: data.requireFullscreen
      },
      select: creatorTestSelect
    })
  }

  async getCreatorTests(creatorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit
    const [tests, total] = await prisma.$transaction([
      prisma.test.findMany({
        where: { creatorId },
        select: creatorTestSelect,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.test.count({ where: { creatorId } })
    ])
    return { tests, total }
  }

  async getTestById(id: string, creatorId: string) {
    const test = await prisma.test.findFirst({
      where: { id, creatorId },
      select: testWithSections
    })

    if (!test) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }

    return {
      ...test,
      sections: test.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) =>
          sanitiseQuestionForTaker({
            ...question,
            questionData: QuestionDataSchema.parse(question.questionData)
          })
        )
      }))
    }
  }

  async updateTest(id: string, creatorId: string, data: UpdateTestInput) {
    const existing = await prisma.test.findFirst({
      where: { id, creatorId },
      select: { id: true, status: true }
    })
    if (!existing) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }
    if (existing.status === TestStatus.PUBLISHED || existing.status === TestStatus.CLOSED) {
      throw new AppError(422, 'CANNOT_EDIT_PUBLISHED_TEST', 'Published or closed tests cannot be edited')
    }

    return prisma.test.update({
      where: { id },
      data: {
        ...data,
        description: data.description === undefined ? undefined : sanitiseHtml(data.description),
        instructions: data.instructions === undefined ? undefined : sanitiseHtml(data.instructions)
      },
      select: creatorTestSelect
    })
  }

  async publishTest(id: string, creatorId: string) {
    const test = await prisma.test.findFirst({
      where: { id, creatorId },
      include: {
        sections: {
          include: { questions: { select: { marks: true } } }
        }
      }
    })

    if (!test) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }
    if (test.sections.length === 0 || test.sections.some((section) => section.questions.length === 0)) {
      throw new AppError(422, 'TEST_INCOMPLETE', 'A test needs at least one section and one question per section')
    }

    const totalMarks = test.sections.reduce(
      (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
      0
    )

    const result = await prisma.$transaction(async (tx) => {
      let accessCode = generateAccessCode()
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const collision = await tx.test.findUnique({ where: { accessCode }, select: { id: true } })
        if (!collision) {
          break
        }
        accessCode = generateAccessCode()
      }

      const accessLink = `${process.env.WEB_ORIGIN ?? 'http://localhost:3000'}/t/${accessCode}`
      const updated = await tx.test.update({
        where: { id },
        data: {
          status: TestStatus.PUBLISHED,
          totalMarks: Math.round(totalMarks),
          accessCode,
          accessLink
        },
        select: { accessCode: true, accessLink: true }
      })
      return updated
    })

    if (!result.accessCode || !result.accessLink) {
      throw new AppError(500, 'PUBLISH_FAILED', 'Unable to publish test')
    }

    return { accessCode: result.accessCode, accessLink: result.accessLink }
  }

  async duplicateTest(id: string, creatorId: string) {
    const original = await prisma.test.findFirst({
      where: { id, creatorId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { questions: { orderBy: { order: 'asc' } } }
        }
      }
    })

    if (!original) {
      throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
    }

    return prisma.test.create({
      data: {
        creatorId,
        title: `${original.title} (Copy)`,
        description: original.description,
        instructions: original.instructions,
        status: TestStatus.DRAFT,
        passingScore: original.passingScore,
        negativeMarkingGlobal: original.negativeMarkingGlobal,
        timingMode: original.timingMode,
        globalDurationMins: original.globalDurationMins,
        startsAt: original.startsAt,
        endsAt: original.endsAt,
        allowMultipleAttempts: original.allowMultipleAttempts,
        maxAttempts: original.maxAttempts,
        showResultsInstantly: original.showResultsInstantly,
        showCorrectAnswers: original.showCorrectAnswers,
        allowSectionBacktrack: original.allowSectionBacktrack,
        shuffleQuestions: original.shuffleQuestions,
        requireFullscreen: original.requireFullscreen,
        sections: {
          create: original.sections.map((section) => ({
            title: section.title,
            instructions: section.instructions,
            order: section.order,
            durationMins: section.durationMins,
            totalQuestionsInPool: section.totalQuestionsInPool,
            questionsToDisplay: section.questionsToDisplay,
            shuffleQuestions: section.shuffleQuestions,
            questions: {
              create: section.questions.map((question) => ({
                type: question.type,
                body: question.body,
                mediaUrl: question.mediaUrl,
                order: question.order,
                marks: question.marks,
                negativeMarks: question.negativeMarks,
                difficulty: question.difficulty,
                tags: question.tags,
                questionData: question.questionData ?? Prisma.JsonNull
              }))
            }
          }))
        }
      },
      select: creatorTestSelect
    })
  }
}

export const testService = new TestService()
