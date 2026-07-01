import { Router } from 'express'
import { z } from 'zod'
import { GuestSessionSchema, LoginSchema, RegisterSchema } from '@quizforge/shared'
import { authService } from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok } from '../utils/response.js'
import { validate } from '../middleware/validate.middleware.js'
import { AppError } from '../utils/appError.js'

export const authRouter = Router()

authRouter.post(
  '/register',
  validate(RegisterSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body)
    ok(res, result, 201)
  })
)

authRouter.post(
  '/login',
  validate(LoginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    ok(res, result)
  })
)

authRouter.post(
  '/refresh',
  validate(z.object({ refreshToken: z.string().optional() })),
  asyncHandler(async (req, res) => {
    const token =
      typeof req.body.refreshToken === 'string'
        ? req.body.refreshToken
        : typeof req.cookies?.refreshToken === 'string'
          ? req.cookies.refreshToken
          : undefined
    if (!token) {
      throw new AppError(401, 'MISSING_REFRESH_TOKEN', 'Refresh token is required')
    }
    ok(res, await authService.refresh(token))
  })
)

authRouter.post(
  '/logout',
  validate(z.object({ refreshToken: z.string().optional() })),
  asyncHandler(async (req, res) => {
    const token =
      typeof req.body.refreshToken === 'string'
        ? req.body.refreshToken
        : typeof req.cookies?.refreshToken === 'string'
          ? req.cookies.refreshToken
          : undefined
    if (token) {
      await authService.logout(token)
    }
    res.clearCookie('refreshToken')
    ok(res, { loggedOut: true })
  })
)

authRouter.post(
  '/guest-session',
  validate(GuestSessionSchema),
  asyncHandler(async (req, res) => {
    const { accessCode, name, email } = req.body
    ok(res, await authService.createGuestSession(accessCode, name, email), 201)
  })
)
