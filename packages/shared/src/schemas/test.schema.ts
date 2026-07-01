import { z } from 'zod'

export const TestStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'])
export const TimingModeSchema = z.enum(['GLOBAL', 'PER_SECTION'])

const testConfigSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().max(5000).optional().nullable(),
  instructions: z.string().max(10000).optional().nullable(),
  passingScore: z.number().min(0).max(100).default(40),
  negativeMarkingGlobal: z.number().min(0).default(0),
  timingMode: TimingModeSchema.default('GLOBAL'),
  globalDurationMins: z.number().int().positive().optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  allowMultipleAttempts: z.boolean().default(false),
  maxAttempts: z.number().int().positive().default(1),
  showResultsInstantly: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(false),
  allowSectionBacktrack: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(false),
  requireFullscreen: z.boolean().default(false)
})

export const CreateTestSchema = testConfigSchema
export const UpdateTestSchema = testConfigSchema.partial()

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

export type TestStatus = z.infer<typeof TestStatusSchema>
export type TimingMode = z.infer<typeof TimingModeSchema>
export type CreateTestInput = z.infer<typeof CreateTestSchema>
export type UpdateTestInput = z.infer<typeof UpdateTestSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
