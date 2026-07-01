import type { ShortAnswerData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function ShortAnswerRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as ShortAnswerData
  const text = value?.type === 'SHORT_ANSWER' ? value.text : ''
  return (
    <input
      value={text}
      maxLength={data.maxLength}
      disabled={disabled}
      onChange={(event) => onChange({ type: 'SHORT_ANSWER', text: event.target.value })}
      className="h-12 w-full rounded-md border border-border bg-card px-4 outline-none focus:border-primary"
      placeholder="Type your answer"
    />
  )
}
