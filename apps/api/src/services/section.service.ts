import type { CreateSectionInput, UpdateSectionInput } from '@quizforge/shared'
import { TestStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'
import { sanitiseHtml } from '../utils/html.js'

const assertEditableTest = async (testId: string, creatorId: string) => {
  const test = await prisma.test.findFirst({
    where: { id: testId, creatorId },
    select: { id: true, status: true }
  })

  if (!test) {
    throw new AppError(404, 'TEST_NOT_FOUND', 'Test not found')
  }
  if (test.status === TestStatus.PUBLISHED || test.status === TestStatus.CLOSED) {
    throw new AppError(422, 'CANNOT_EDIT_PUBLISHED_TEST', 'Published or closed tests cannot be edited')
  }
}

export class SectionService {
  async addSection(testId: string, creatorId: string, data: CreateSectionInput) {
    await assertEditableTest(testId, creatorId)
    const max = await prisma.section.aggregate({
      where: { testId },
      _max: { order: true }
    })

    return prisma.section.create({
      data: {
        testId,
        title: data.title,
        instructions: sanitiseHtml(data.instructions),
        order: (max._max.order ?? 0) + 1,
        durationMins: data.durationMins,
        questionsToDisplay: data.questionsToDisplay,
        shuffleQuestions: data.shuffleQuestions
      }
    })
  }

  async updateSection(id: string, testId: string, creatorId: string, data: UpdateSectionInput) {
    await assertEditableTest(testId, creatorId)
    const section = await prisma.section.findFirst({ where: { id, testId }, select: { id: true } })
    if (!section) {
      throw new AppError(404, 'SECTION_NOT_FOUND', 'Section not found')
    }

    return prisma.section.update({
      where: { id },
      data: {
        ...data,
        instructions: data.instructions === undefined ? undefined : sanitiseHtml(data.instructions)
      }
    })
  }

  async deleteSection(id: string, testId: string, creatorId: string) {
    await assertEditableTest(testId, creatorId)
    await prisma.section.deleteMany({ where: { id, testId } })
  }

  async reorderSections(testId: string, creatorId: string, orderedIds: string[]) {
    await assertEditableTest(testId, creatorId)
    const sections = await prisma.section.findMany({
      where: { testId },
      select: { id: true }
    })
    const sectionIds = new Set(sections.map((section) => section.id))
    const valid =
      orderedIds.length === sectionIds.size && orderedIds.every((sectionId) => sectionIds.has(sectionId))
    if (!valid) {
      throw new AppError(400, 'INVALID_SECTION_ORDER', 'Ordered IDs must match all sections in this test')
    }

    await prisma.$transaction(
      orderedIds.map((sectionId, index) =>
        prisma.section.update({ where: { id: sectionId }, data: { order: index + 1 } })
      )
    )
  }
}

export const sectionService = new SectionService()
