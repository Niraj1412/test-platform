import jwt, { type SignOptions } from 'jsonwebtoken'
import { AppError } from './appError.js'

export interface AccessTokenPayload {
  id: string
  email: string
  role: 'ADMIN' | 'CREATOR' | 'TAKER'
}

export interface GuestTokenPayload {
  role: 'GUEST'
  guestSessionId: string
  name: string
  email: string
  testId: string
}

export type AuthTokenPayload = AccessTokenPayload | GuestTokenPayload

const readSecret = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new AppError(500, 'CONFIG_ERROR', `${name} is not configured`)
  }
  return value
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '1h'
  return jwt.sign(payload, readSecret('JWT_SECRET'), { expiresIn } as SignOptions)
}

export const signRefreshToken = (payload: AccessTokenPayload) => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d'
  return jwt.sign(payload, readSecret('JWT_REFRESH_SECRET'), { expiresIn } as SignOptions)
}

export const signGuestToken = (payload: GuestTokenPayload, ttlSeconds: number) =>
  jwt.sign(payload, readSecret('JWT_SECRET'), { expiresIn: ttlSeconds } as SignOptions)

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, readSecret('JWT_SECRET')) as AuthTokenPayload
  } catch {
    throw new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired token')
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, readSecret('JWT_REFRESH_SECRET')) as AccessTokenPayload
  } catch {
    throw new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired refresh token')
  }
}

export const refreshExpiryDate = () => {
  const days = 30
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + days)
  return expiresAt
}
