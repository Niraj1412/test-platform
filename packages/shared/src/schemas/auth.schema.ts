import { z } from 'zod'

export const UserRoleSchema = z.enum(['ADMIN', 'CREATOR', 'TAKER'])

export const RegisterSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128)
})

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1)
})

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1).optional()
})

export type UserRole = z.infer<typeof UserRoleSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
