import type { NextFunction, Request, Response } from 'express'
import { isAppError } from '../utils/appError.js'

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        fields: error.fields
      }
    })
  }

  const message = error instanceof Error ? error.stack || error.message : String(error)
  console.error('[api:error]', error)

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : message
    }
  })
}
