import { z } from 'zod'

export const MCQSingleResponseSchema = z.object({
  type: z.literal('MCQ_SINGLE'),
  selectedOptionId: z.string().optional().nullable()
})

export const MCQMultipleResponseSchema = z.object({
  type: z.literal('MCQ_MULTIPLE'),
  selectedOptionIds: z.array(z.string()).default([])
})

export const TrueFalseResponseSchema = z.object({
  type: z.literal('TRUE_FALSE'),
  answer: z.boolean().optional().nullable()
})

export const ShortAnswerResponseSchema = z.object({
  type: z.literal('SHORT_ANSWER'),
  text: z.string().default('')
})

export const LongAnswerResponseSchema = z.object({
  type: z.literal('LONG_ANSWER'),
  text: z.string().default('')
})

export const FillBlankResponseSchema = z.object({
  type: z.literal('FILL_BLANK'),
  blankAnswers: z.record(z.string(), z.string()).default({})
})

export const MatchingResponseSchema = z.object({
  type: z.literal('MATCHING'),
  pairs: z.record(z.string(), z.string()).default({})
})

export const OrderingResponseSchema = z.object({
  type: z.literal('ORDERING'),
  orderedIds: z.array(z.string()).default([])
})

export const NumericalResponseSchema = z.object({
  type: z.literal('NUMERICAL'),
  value: z.number().optional().nullable(),
  unit: z.string().optional()
})

export const FileUploadResponseSchema = z.object({
  type: z.literal('FILE_UPLOAD'),
  fileUrl: z.string().url().optional().nullable(),
  fileName: z.string().optional().nullable()
})

export const ResponseDataSchema = z.discriminatedUnion('type', [
  MCQSingleResponseSchema,
  MCQMultipleResponseSchema,
  TrueFalseResponseSchema,
  ShortAnswerResponseSchema,
  LongAnswerResponseSchema,
  FillBlankResponseSchema,
  MatchingResponseSchema,
  OrderingResponseSchema,
  NumericalResponseSchema,
  FileUploadResponseSchema
])

export const GuestSessionSchema = z.object({
  accessCode: z.string().min(6).max(12),
  name: z.string().min(1).max(120),
  email: z.string().email()
})

export const JoinTestSchema = z.object({
  accessCode: z.string().min(6).max(12)
})

export const StartAttemptSchema = z.object({
  testId: z.string().uuid(),
  guestData: z
    .object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      guestSessionId: z.string().uuid()
    })
    .optional()
    .nullable()
})

export const SaveAnswerSchema = z.object({
  questionId: z.string().uuid(),
  responseData: ResponseDataSchema,
  isFlagged: z.boolean().default(false)
})

export const ManualGradeSchema = z.object({
  earnedMarks: z.number().min(0),
  graderNotes: z.string().max(2000).optional()
})

export type MCQSingleResponse = z.infer<typeof MCQSingleResponseSchema>
export type MCQMultipleResponse = z.infer<typeof MCQMultipleResponseSchema>
export type TrueFalseResponse = z.infer<typeof TrueFalseResponseSchema>
export type ShortAnswerResponse = z.infer<typeof ShortAnswerResponseSchema>
export type LongAnswerResponse = z.infer<typeof LongAnswerResponseSchema>
export type FillBlankResponse = z.infer<typeof FillBlankResponseSchema>
export type MatchingResponse = z.infer<typeof MatchingResponseSchema>
export type OrderingResponse = z.infer<typeof OrderingResponseSchema>
export type NumericalResponse = z.infer<typeof NumericalResponseSchema>
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>
export type ResponseData = z.infer<typeof ResponseDataSchema>
export type SaveAnswerInput = z.infer<typeof SaveAnswerSchema>
