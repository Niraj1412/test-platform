import { z } from 'zod'

export const QuestionTypeSchema = z.enum([
  'MCQ_SINGLE',
  'MCQ_MULTIPLE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'FILL_BLANK',
  'MATCHING',
  'ORDERING',
  'NUMERICAL',
  'FILE_UPLOAD'
])

export const DifficultyLevelSchema = z.enum(['EASY', 'MEDIUM', 'HARD'])

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean()
})

export const MCQSingleDataSchema = z.object({
  type: z.literal('MCQ_SINGLE'),
  options: z.array(optionSchema).min(2),
  shuffleOptions: z.boolean().default(true)
})

export const MCQMultipleDataSchema = z.object({
  type: z.literal('MCQ_MULTIPLE'),
  options: z.array(optionSchema).min(2),
  shuffleOptions: z.boolean().default(true),
  partialCredit: z.boolean().default(false),
  partialCreditMode: z.enum(['proportional', 'all_or_nothing']).default('proportional')
})

export const TrueFalseDataSchema = z.object({
  type: z.literal('TRUE_FALSE'),
  correctAnswer: z.boolean()
})

export const ShortAnswerDataSchema = z.object({
  type: z.literal('SHORT_ANSWER'),
  maxLength: z.number().int().positive().optional(),
  rubric: z.string().optional()
})

export const LongAnswerDataSchema = z.object({
  type: z.literal('LONG_ANSWER'),
  wordLimit: z.number().int().positive().optional(),
  rubric: z.string().optional()
})

export const FillBlankDataSchema = z.object({
  type: z.literal('FILL_BLANK'),
  template: z.string().min(1),
  blanks: z
    .array(
      z.object({
        id: z.string().min(1),
        acceptedAnswers: z.array(z.string().min(1)).min(1),
        caseSensitive: z.boolean().default(false),
        matchType: z.enum(['exact', 'contains']).default('exact')
      })
    )
    .min(1)
})

export const MatchingDataSchema = z.object({
  type: z.literal('MATCHING'),
  pairs: z
    .array(
      z.object({
        id: z.string().min(1),
        prompt: z.string().min(1),
        match: z.string().min(1)
      })
    )
    .min(2),
  shuffleMatches: z.boolean().default(true)
})

export const OrderingDataSchema = z.object({
  type: z.literal('ORDERING'),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
        correctPosition: z.number().int().nonnegative()
      })
    )
    .min(2)
})

export const NumericalDataSchema = z.object({
  type: z.literal('NUMERICAL'),
  correctAnswer: z.number(),
  tolerance: z.number().nonnegative().default(0),
  unit: z.string().optional()
})

export const FileUploadDataSchema = z.object({
  type: z.literal('FILE_UPLOAD'),
  acceptedTypes: z.array(z.enum(['pdf', 'image'])).min(1),
  maxSizeMb: z.number().positive().default(10),
  rubric: z.string().optional()
})

export const QuestionDataSchema = z.discriminatedUnion('type', [
  MCQSingleDataSchema,
  MCQMultipleDataSchema,
  TrueFalseDataSchema,
  ShortAnswerDataSchema,
  LongAnswerDataSchema,
  FillBlankDataSchema,
  MatchingDataSchema,
  OrderingDataSchema,
  NumericalDataSchema,
  FileUploadDataSchema
])

export const BaseQuestionSchema = z.object({
  body: z.string().min(1),
  mediaUrl: z.string().url().optional().nullable(),
  marks: z.number().positive().default(1),
  negativeMarks: z.number().nonnegative().default(0),
  difficulty: DifficultyLevelSchema.default('MEDIUM'),
  tags: z.array(z.string()).default([]),
  questionData: QuestionDataSchema
})

export const CreateQuestionSchema = BaseQuestionSchema.extend({
  sectionId: z.string().uuid().optional()
})

export const UpdateQuestionSchema = BaseQuestionSchema.partial().extend({
  questionData: QuestionDataSchema.optional()
})

export const ReorderQuestionsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1)
})

export type QuestionType = z.infer<typeof QuestionTypeSchema>
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>
export type MCQSingleData = z.infer<typeof MCQSingleDataSchema>
export type MCQMultipleData = z.infer<typeof MCQMultipleDataSchema>
export type TrueFalseData = z.infer<typeof TrueFalseDataSchema>
export type ShortAnswerData = z.infer<typeof ShortAnswerDataSchema>
export type LongAnswerData = z.infer<typeof LongAnswerDataSchema>
export type FillBlankData = z.infer<typeof FillBlankDataSchema>
export type MatchingData = z.infer<typeof MatchingDataSchema>
export type OrderingData = z.infer<typeof OrderingDataSchema>
export type NumericalData = z.infer<typeof NumericalDataSchema>
export type FileUploadData = z.infer<typeof FileUploadDataSchema>
export type QuestionData = z.infer<typeof QuestionDataSchema>
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>
