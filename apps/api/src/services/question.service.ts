import path from 'node:path'
import type { CreateQuestionInput, UpdateQuestionInput } from '@quizforge/shared'
import { QuestionDataSchema } from '@quizforge/shared'
import { TestStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'
import { sanitiseHtml } from '../utils/html.js'
import { uploadBufferToS3 } from '../utils/s3.js'

const assertEditableSection = async (sectionId: string, creatorId: string) => {
  const section = await prisma.section.findFirst({
    where: { id: sectionId, test: { creatorId } },
    select: { id: true, test: { select: { status: true } } }
  })

  if (!section) {
    throw new AppError(404, 'SECTION_NOT_FOUND', 'Section not found')
  }
  if (section.test.status === TestStatus.PUBLISHED || section.test.status === TestStatus.CLOSED) {
    throw new AppError(422, 'CANNOT_EDIT_PUBLISHED_TEST', 'Published or closed tests cannot be edited')
  }
}

const assertEditableQuestion = async (questionId: string, creatorId: string) => {
  const question = await prisma.question.findFirst({
    where: { id: questionId, section: { test: { creatorId } } },
    select: {
      id: true,
      sectionId: true,
      section: { select: { test: { select: { status: true } } } }
    }
  })

  if (!question) {
    throw new AppError(404, 'QUESTION_NOT_FOUND', 'Question not found')
  }
  if (
    question.section.test.status === TestStatus.PUBLISHED ||
    question.section.test.status === TestStatus.CLOSED
  ) {
    throw new AppError(422, 'CANNOT_EDIT_PUBLISHED_TEST', 'Published or closed tests cannot be edited')
  }
  return question
}

export class QuestionService {
  async addQuestion(sectionId: string, creatorId: string, data: CreateQuestionInput) {
    await assertEditableSection(sectionId, creatorId)
    const questionData = QuestionDataSchema.parse(data.questionData)
    const max = await prisma.question.aggregate({
      where: { sectionId },
      _max: { order: true }
    })

    const question = await prisma.$transaction(async (tx) => {
      const created = await tx.question.create({
        data: {
          sectionId,
          type: questionData.type,
          body: sanitiseHtml(data.body) ?? '',
          mediaUrl: data.mediaUrl,
          order: (max._max.order ?? 0) + 1,
          marks: data.marks,
          negativeMarks: data.negativeMarks,
          difficulty: data.difficulty,
          tags: data.tags,
          questionData
        }
      })
      await tx.section.update({
        where: { id: sectionId },
        data: {
          totalQuestionsInPool: { increment: 1 },
          questionsToDisplay: { increment: 1 }
        }
      })
      return created
    })

    return question
  }

  async updateQuestion(id: string, creatorId: string, data: UpdateQuestionInput) {
    await assertEditableQuestion(id, creatorId)
    const questionData = data.questionData ? QuestionDataSchema.parse(data.questionData) : undefined

    return prisma.question.update({
      where: { id },
      data: {
        body: data.body === undefined ? undefined : (sanitiseHtml(data.body) ?? ''),
        mediaUrl: data.mediaUrl,
        marks: data.marks,
        negativeMarks: data.negativeMarks,
        difficulty: data.difficulty,
        tags: data.tags,
        type: questionData?.type,
        questionData
      }
    })
  }

  async deleteQuestion(id: string, creatorId: string) {
    const question = await assertEditableQuestion(id, creatorId)
    await prisma.$transaction([
      prisma.question.delete({ where: { id } }),
      prisma.section.update({
        where: { id: question.sectionId },
        data: {
          totalQuestionsInPool: { decrement: 1 },
          questionsToDisplay: { decrement: 1 }
        }
      })
    ])
  }

  async reorderQuestions(sectionId: string, creatorId: string, orderedIds: string[]) {
    await assertEditableSection(sectionId, creatorId)
    const questions = await prisma.question.findMany({
      where: { sectionId },
      select: { id: true }
    })
    const questionIds = new Set(questions.map((question) => question.id))
    const valid =
      orderedIds.length === questionIds.size && orderedIds.every((questionId) => questionIds.has(questionId))
    if (!valid) {
      throw new AppError(400, 'INVALID_QUESTION_ORDER', 'Ordered IDs must match all questions in this section')
    }

    await prisma.$transaction(
      orderedIds.map((questionId, index) =>
        prisma.question.update({ where: { id: questionId }, data: { order: index + 1 } })
      )
    )
  }

  async uploadQuestionMedia(questionId: string, creatorId: string, file: Express.Multer.File) {
    await assertEditableQuestion(questionId, creatorId)
    const extension = path.extname(file.originalname)
    const safeName = `${Date.now()}${extension}`
    const key = `questions/${questionId}/${safeName}`
    const url = await uploadBufferToS3(key, file.buffer, file.mimetype)
    await prisma.question.update({
      where: { id: questionId },
      data: { mediaUrl: url }
    })
    return { url }
  }
}

export const questionService = new QuestionService()
