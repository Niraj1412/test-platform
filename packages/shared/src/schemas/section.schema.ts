import { z } from 'zod'

export const CreateSectionSchema = z.object({
  title: z.string().min(1).max(180),
  instructions: z.string().max(5000).optional().nullable(),
  durationMins: z.number().int().positive().optional().nullable(),
  questionsToDisplay: z.number().int().nonnegative().default(0),
  shuffleQuestions: z.boolean().default(false)
})

export const UpdateSectionSchema = CreateSectionSchema.partial()

export const ReorderSectionsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1)
})

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>
export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>
