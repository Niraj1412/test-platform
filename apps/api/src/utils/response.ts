import type { Response } from 'express'

export const ok = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({ success: true, data })

export const paginated = <T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number }
) => res.status(200).json({ success: true, data, meta })
