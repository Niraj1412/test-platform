import { Router } from 'express'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { CreateTestSchema, PaginationSchema, UpdateTestSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { testService } from '../services/test.service.js'
import { AppError } from '../utils/appError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok, paginated } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const testsRouter = Router()

const idParams = z.object({ id: z.string().uuid() })

const requireCreatorId = (req: Express.Request) => {
  if (!req.user.id) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authenticated user is required')
  }
  return req.user.id
}

testsRouter.use(authMiddleware, requireRole(UserRole.CREATOR))

testsRouter.get(
  '/',
  validate(PaginationSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit } = req.query
    const result = await testService.getCreatorTests(requireCreatorId(req), Number(page), Number(limit))
    paginated(res, result.tests, { page: Number(page), limit: Number(limit), total: result.total })
  })
)

testsRouter.post(
  '/',
  validate(CreateTestSchema),
  asyncHandler(async (req, res) => {
    ok(res, await testService.createTest(requireCreatorId(req), req.body), 201)
  })
)

testsRouter.get(
  '/:id',
  validate(idParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await testService.getTestById(requireParam(req, 'id'), requireCreatorId(req)))
  })
)

testsRouter.patch(
  '/:id',
  validate(idParams, 'params'),
  validate(UpdateTestSchema),
  asyncHandler(async (req, res) => {
    ok(res, await testService.updateTest(requireParam(req, 'id'), requireCreatorId(req), req.body))
  })
)

testsRouter.post(
  '/:id/publish',
  validate(idParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await testService.publishTest(requireParam(req, 'id'), requireCreatorId(req)))
  })
)

testsRouter.post(
  '/:id/duplicate',
  validate(idParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await testService.duplicateTest(requireParam(req, 'id'), requireCreatorId(req)), 201)
  })
)
