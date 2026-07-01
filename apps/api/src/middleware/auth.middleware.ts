import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Missing bearer token' }
    })
  }

  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    return next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' }
    })
  }
}
