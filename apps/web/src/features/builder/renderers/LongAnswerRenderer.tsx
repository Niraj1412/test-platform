import type { LongAnswerData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function LongAnswerRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as LongAnswerData
  const text = value?.type === 'LONG_ANSWER' ? value.text : ''
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div>
      <textarea
        value={text}
        disabled={disabled}
        onChange={(event) => onChange({ type: 'LONG_ANSWER', text: event.target.value })}
        className="min-h-40 w-full resize-y rounded-md border border-border bg-card p-4 outline-none focus:border-primary"
        placeholder="Write your answer"
      />
      {data.wordLimit && (
        <div className="mt-2 text-right text-xs text-muted-foreground">
          {wordCount} / {data.wordLimit} words
        </div>
      )}
    </div>
  )
}
