import { Router } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { CreateQuestionSchema, ReorderQuestionsSchema, UpdateQuestionSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { questionService } from '../services/question.service.js'
import { AppError } from '../utils/appError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const questionsRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const sectionParams = z.object({ sectionId: z.string().uuid() })
const questionParams = z.object({ questionId: z.string().uuid() })

const requireCreatorId = (req: Express.Request) => {
  if (!req.user.id) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authenticated user is required')
  }
  return req.user.id
}

questionsRouter.use(authMiddleware, requireRole(UserRole.CREATOR))

questionsRouter.post(
  '/sections/:sectionId/questions',
  validate(sectionParams, 'params'),
  validate(CreateQuestionSchema),
  asyncHandler(async (req, res) => {
    ok(res, await questionService.addQuestion(requireParam(req, 'sectionId'), requireCreatorId(req), req.body), 201)
  })
)

questionsRouter.patch(
  '/questions/:questionId',
  validate(questionParams, 'params'),
  validate(UpdateQuestionSchema),
  asyncHandler(async (req, res) => {
    ok(res, await questionService.updateQuestion(requireParam(req, 'questionId'), requireCreatorId(req), req.body))
  })
)

questionsRouter.delete(
  '/questions/:questionId',
  validate(questionParams, 'params'),
  asyncHandler(async (req, res) => {
    await questionService.deleteQuestion(requireParam(req, 'questionId'), requireCreatorId(req))
    ok(res, { deleted: true })
  })
)

questionsRouter.patch(
  '/sections/:sectionId/questions/reorder',
  validate(sectionParams, 'params'),
  validate(ReorderQuestionsSchema),
  asyncHandler(async (req, res) => {
    await questionService.reorderQuestions(requireParam(req, 'sectionId'), requireCreatorId(req), req.body.orderedIds)
    ok(res, { reordered: true })
  })
)

questionsRouter.post(
  '/questions/:questionId/media',
  validate(questionParams, 'params'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(400, 'FILE_REQUIRED', 'A media file is required')
    }
    ok(
      res,
      await questionService.uploadQuestionMedia(requireParam(req, 'questionId'), requireCreatorId(req), req.file),
      201
    )
  })
)
