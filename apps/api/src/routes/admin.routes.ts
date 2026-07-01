import { Router } from 'express'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { PaginationSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { adminService } from '../services/admin.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok, paginated } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const adminRouter = Router()

adminRouter.use(authMiddleware, requireRole(UserRole.ADMIN))

adminRouter.get(
  '/users',
  validate(PaginationSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit } = req.query
    const result = await adminService.listUsers(Number(page), Number(limit))
    paginated(res, result.users, { page: Number(page), limit: Number(limit), total: result.total })
  })
)

adminRouter.get(
  '/tests',
  validate(PaginationSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit } = req.query
    const result = await adminService.listTests(Number(page), Number(limit))
    paginated(res, result.tests, { page: Number(page), limit: Number(limit), total: result.total })
  })
)

adminRouter.post(
  '/tests/:id/archive',
  validate(z.object({ id: z.string().uuid() }), 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await adminService.archiveTest(requireParam(req, 'id')))
  })
)
