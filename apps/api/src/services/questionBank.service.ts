import type { CreateQuestionInput } from '@quizforge/shared'
import { QuestionDataSchema } from '@quizforge/shared'
import { Prisma, QuestionType } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'
import { sanitiseHtml } from '../utils/html.js'

export class QuestionBankService {
  async list(creatorId: string, query?: string, type?: string, tag?: string) {
    const parsedType = Object.values(QuestionType).find((item) => item === type)
    return prisma.questionBank.findMany({
      where: {
        creatorId,
        type: parsedType,
        tags: tag ? { has: tag } : undefined,
        body: query ? { contains: query, mode: 'insensitive' } : undefined
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async create(creatorId: string, data: CreateQuestionInput) {
    const questionData = QuestionDataSchema.parse(data.questionData)
    return prisma.questionBank.create({
      data: {
        creatorId,
        type: questionData.type,
        body: sanitiseHtml(data.body) ?? '',
        mediaUrl: data.mediaUrl,
        marks: data.marks,
        difficulty: data.difficulty,
        tags: data.tags,
        questionData
      }
    })
  }

  async saveQuestion(creatorId: string, questionId: string) {
    const question = await prisma.question.findFirst({
      where: { id: questionId, section: { test: { creatorId } } }
    })
    if (!question) {
      throw new AppError(404, 'QUESTION_NOT_FOUND', 'Question not found')
    }

    return prisma.questionBank.create({
      data: {
        creatorId,
        questionId,
        type: question.type,
        body: question.body,
        mediaUrl: question.mediaUrl,
        marks: question.marks,
        difficulty: question.difficulty,
        tags: question.tags,
        questionData: question.questionData ?? Prisma.JsonNull
      }
    })
  }

  async delete(creatorId: string, id: string) {
    await prisma.questionBank.deleteMany({ where: { id, creatorId } })
  }
}

export const questionBankService = new QuestionBankService()
