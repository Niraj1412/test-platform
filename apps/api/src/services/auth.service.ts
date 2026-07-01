import { randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'
import type { RegisterInput, LoginInput, SafeUser } from '@quizforge/shared'
import { TestStatus, UserRole, type User } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'
import { hashPassword, verifyPassword } from '../utils/hash.js'
import {
  refreshExpiryDate,
  signAccessToken,
  signGuestToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.js'

const toSafeUser = (user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'isEmailVerified' | 'createdAt'>): SafeUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt
})

const createMailer = () => {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true })
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
  })
}

const sendVerificationEmail = async (email: string, name: string) => {
  const transport = createMailer()
  await transport.sendMail({
    to: email,
    from: process.env.SMTP_FROM ?? 'QuizForge <noreply@quizforge.local>',
    subject: 'Verify your QuizForge account',
    text: `Hi ${name}, your QuizForge creator account is ready.`
  })
}

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: SafeUser }> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true }
    })
    if (existing) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists')
    }

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: UserRole.CREATOR
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true
      }
    })

    await sendVerificationEmail(user.email, user.name)
    return { user: toSafeUser(user) }
  }

  async login(data: LoginInput): Promise<{ accessToken: string; refreshToken: string; user: SafeUser }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        isEmailVerified: true,
        createdAt: true
      }
    })

    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiryDate()
      }
    })

    return {
      accessToken,
      refreshToken,
      user: toSafeUser(user)
    }
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
      select: {
        token: true,
        expiresAt: true,
        user: { select: { id: true, email: true, role: true } }
      }
    })

    if (!stored || stored.expiresAt.getTime() <= Date.now()) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired')
    }

    verifyRefreshToken(token)
    return {
      accessToken: signAccessToken({
        id: stored.user.id,
        email: stored.user.email,
        role: stored.user.role
      })
    }
  }

  async logout(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } })
  }

  async createGuestSession(
    accessCode: string,
    name: string,
    email: string
  ): Promise<{ guestToken: string }> {
    const test = await prisma.test.findUnique({
      where: { accessCode },
      select: { id: true, status: true, startsAt: true, endsAt: true }
    })

    if (!test || test.status !== TestStatus.PUBLISHED) {
      throw new AppError(404, 'TEST_NOT_AVAILABLE', 'Test is not available')
    }

    const now = new Date()
    if (test.startsAt && test.startsAt > now) {
      throw new AppError(403, 'TEST_NOT_STARTED', 'Test window has not started')
    }
    if (test.endsAt && test.endsAt < now) {
      throw new AppError(403, 'TEST_CLOSED', 'Test window has ended')
    }

    const ttlSeconds = test.endsAt
      ? Math.max(60, Math.floor((test.endsAt.getTime() - now.getTime()) / 1000))
      : 24 * 60 * 60

    return {
      guestToken: signGuestToken(
        {
          role: 'GUEST',
          guestSessionId: randomUUID(),
          name,
          email,
          testId: test.id
        },
        ttlSeconds
      )
    }
  }
}

export const authService = new AuthService()
