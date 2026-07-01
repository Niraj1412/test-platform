import type { Request } from 'express'
import { AppError } from './appError.js'

export const requireParam = (req: Request, name: string) => {
  const value = req.params[name]
  if (typeof value !== 'string') {
    throw new AppError(400, 'INVALID_ROUTE_PARAM', `Missing or invalid route parameter: ${name}`)
  }
  return value
}
