import { Router } from 'express'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { CreateSectionSchema, ReorderSectionsSchema, UpdateSectionSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { sectionService } from '../services/section.service.js'
import { AppError } from '../utils/appError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const sectionsRouter = Router()

const testIdParams = z.object({ testId: z.string().uuid() })
const sectionParams = z.object({ testId: z.string().uuid(), sectionId: z.string().uuid() })

const requireCreatorId = (req: Express.Request) => {
  if (!req.user.id) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authenticated user is required')
  }
  return req.user.id
}

sectionsRouter.use(authMiddleware, requireRole(UserRole.CREATOR))

sectionsRouter.post(
  '/tests/:testId/sections',
  validate(testIdParams, 'params'),
  validate(CreateSectionSchema),
  asyncHandler(async (req, res) => {
    ok(res, await sectionService.addSection(requireParam(req, 'testId'), requireCreatorId(req), req.body), 201)
  })
)

sectionsRouter.patch(
  '/tests/:testId/sections/:sectionId',
  validate(sectionParams, 'params'),
  validate(UpdateSectionSchema),
  asyncHandler(async (req, res) => {
    ok(
      res,
      await sectionService.updateSection(
        requireParam(req, 'sectionId'),
        requireParam(req, 'testId'),
        requireCreatorId(req),
        req.body
      )
    )
  })
)

sectionsRouter.delete(
  '/tests/:testId/sections/:sectionId',
  validate(sectionParams, 'params'),
  asyncHandler(async (req, res) => {
    await sectionService.deleteSection(
      requireParam(req, 'sectionId'),
      requireParam(req, 'testId'),
      requireCreatorId(req)
    )
    ok(res, { deleted: true })
  })
)

sectionsRouter.patch(
  '/tests/:testId/sections/reorder',
  validate(testIdParams, 'params'),
  validate(ReorderSectionsSchema),
  asyncHandler(async (req, res) => {
    await sectionService.reorderSections(requireParam(req, 'testId'), requireCreatorId(req), req.body.orderedIds)
    ok(res, { reordered: true })
  })
)
