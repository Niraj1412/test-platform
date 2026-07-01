export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly fields?: Record<string, string[]>

  constructor(statusCode: number, code: string, message: string, fields?: Record<string, string[]>) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.fields = fields
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError
