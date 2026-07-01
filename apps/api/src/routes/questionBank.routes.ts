import { Router } from 'express'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { CreateQuestionSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { questionBankService } from '../services/questionBank.service.js'
import { AppError } from '../utils/appError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const questionBankRouter = Router()

const querySchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  tag: z.string().optional()
})

const idParams = z.object({ id: z.string().uuid() })
const saveParams = z.object({ questionId: z.string().uuid() })

const requireCreatorId = (req: Express.Request) => {
  if (!req.user.id) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authenticated user is required')
  }
  return req.user.id
}

questionBankRouter.use(authMiddleware, requireRole(UserRole.CREATOR))

questionBankRouter.get(
  '/',
  validate(querySchema, 'query'),
  asyncHandler(async (req, res) => {
    ok(
      res,
      await questionBankService.list(
        requireCreatorId(req),
        req.query.query?.toString(),
        req.query.type?.toString(),
        req.query.tag?.toString()
      )
    )
  })
)

questionBankRouter.post(
  '/',
  validate(CreateQuestionSchema),
  asyncHandler(async (req, res) => {
    ok(res, await questionBankService.create(requireCreatorId(req), req.body), 201)
  })
)

questionBankRouter.post(
  '/from-question/:questionId',
  validate(saveParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await questionBankService.saveQuestion(requireCreatorId(req), requireParam(req, 'questionId')), 201)
  })
)

questionBankRouter.delete(
  '/:id',
  validate(idParams, 'params'),
  asyncHandler(async (req, res) => {
    await questionBankService.delete(requireCreatorId(req), requireParam(req, 'id'))
    ok(res, { deleted: true })
  })
)
