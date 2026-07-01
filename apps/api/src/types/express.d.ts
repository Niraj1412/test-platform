import type { UserRole } from '@prisma/client'

declare global {
  namespace Express {
    interface UserContext {
      id?: string
      role: UserRole | 'GUEST'
      email?: string
      guestSessionId?: string
      name?: string
      testId?: string
    }

    interface Request {
      user: UserContext
    }
  }
}

export {}
