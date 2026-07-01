import type { MCQMultipleData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function MCQMultipleRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as MCQMultipleData
  const selected = new Set(value?.type === 'MCQ_MULTIPLE' ? value.selectedOptionIds : [])

  return (
    <div className="space-y-4">
      {data.options.map((option) => (
        <label
          key={option.id}
          className="flex min-h-16 cursor-pointer items-center gap-4 rounded-md border border-border bg-card px-4 text-base transition has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
        >
          <input
            type="checkbox"
            disabled={disabled}
            checked={selected.has(option.id)}
            onChange={(event) => {
              const next = new Set(selected)
              if (event.target.checked) {
                next.add(option.id)
              } else {
                next.delete(option.id)
              }
              onChange({ type: 'MCQ_MULTIPLE', selectedOptionIds: [...next] })
            }}
            className="h-5 w-5 accent-primary"
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  )
}
