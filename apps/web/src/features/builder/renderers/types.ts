import type { Question, ResponseData } from '@quizforge/shared'

export interface RendererProps {
  question: Question
  value: ResponseData | null
  onChange: (data: ResponseData) => void
  disabled?: boolean
}
