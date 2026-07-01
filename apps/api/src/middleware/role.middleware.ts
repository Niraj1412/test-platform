import type { UserRole } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log('requireRole middleware triggered:', { user: req.user, roles })
    if (!req.user || req.user.role === 'GUEST') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      })
    }

    // ADMIN users bypass role restrictions (superuser privilege)
    if (req.user.role === 'ADMIN') {
      return next()
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      })
    }

    return next()
  }
