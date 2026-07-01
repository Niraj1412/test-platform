import type { QuestionData } from '@quizforge/shared'

export interface EditorProps {
  value: QuestionData
  onChange: (data: QuestionData) => void
}
