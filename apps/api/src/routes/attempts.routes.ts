import { Router } from 'express'
import { z } from 'zod'
import { JoinTestSchema, SaveAnswerSchema, StartAttemptSchema } from '@quizforge/shared'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { attemptService } from '../services/attempt.service.js'
import { AppError } from '../utils/appError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok } from '../utils/response.js'
import { requireParam } from '../utils/routeParams.js'

export const attemptsRouter = Router()

const attemptParams = z.object({ attemptId: z.string().uuid() })

attemptsRouter.post(
  '/join',
  validate(JoinTestSchema),
  asyncHandler(async (req, res) => {
    ok(res, await attemptService.joinTest(req.body.accessCode))
  })
)

attemptsRouter.post(
  '/start',
  authMiddleware,
  validate(StartAttemptSchema),
  asyncHandler(async (req, res) => {
    const takerId = req.user.role === 'GUEST' ? null : (req.user.id ?? null)
    const guestData =
      req.user.role === 'GUEST'
        ? {
            name: req.user.name ?? req.body.guestData?.name ?? 'Guest',
            email: req.user.email ?? req.body.guestData?.email ?? 'guest@example.com',
            guestSessionId: req.user.guestSessionId ?? req.body.guestData?.guestSessionId
          }
        : req.body.guestData

    if (!takerId && !guestData?.guestSessionId) {
      throw new AppError(401, 'UNAUTHENTICATED', 'A taker or guest session is required')
    }
    ok(res, await attemptService.startAttempt(req.body.testId, takerId, guestData), 201)
  })
)

attemptsRouter.patch(
  '/:attemptId/answer',
  authMiddleware,
  validate(attemptParams, 'params'),
  validate(SaveAnswerSchema),
  asyncHandler(async (req, res) => {
    await attemptService.saveAnswer(
      requireParam(req, 'attemptId'),
      req.user,
      req.body.questionId,
      req.body.responseData,
      req.body.isFlagged
    )
    ok(res, { saved: true })
  })
)

attemptsRouter.post(
  '/:attemptId/submit',
  authMiddleware,
  validate(attemptParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await attemptService.submitAttempt(requireParam(req, 'attemptId'), req.user))
  })
)

attemptsRouter.get(
  '/:attemptId/resume',
  authMiddleware,
  validate(attemptParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await attemptService.resumeAttempt(requireParam(req, 'attemptId'), req.user))
  })
)

attemptsRouter.get(
  '/:attemptId',
  authMiddleware,
  validate(attemptParams, 'params'),
  asyncHandler(async (req, res) => {
    ok(res, await attemptService.getAttempt(requireParam(req, 'attemptId'), req.user))
  })
)
