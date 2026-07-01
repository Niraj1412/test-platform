import type { MCQSingleData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function MCQSingleRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as MCQSingleData
  const selected = value?.type === 'MCQ_SINGLE' ? value.selectedOptionId : null

  return (
    <div className="space-y-4">
      {data.options.map((option) => (
        <label
          key={option.id}
          className="flex min-h-16 cursor-pointer items-center gap-4 rounded-md border border-border bg-card px-4 text-base transition has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
        >
          <input
            type="radio"
            name={question.id}
            disabled={disabled}
            checked={selected === option.id}
            onChange={() => onChange({ type: 'MCQ_SINGLE', selectedOptionId: option.id })}
            className="h-5 w-5 accent-primary"
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  )
}
