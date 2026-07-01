import type { RendererProps } from './types'

export function TrueFalseRenderer({ question, value, onChange, disabled }: RendererProps) {
  const selected = value?.type === 'TRUE_FALSE' ? value.answer : null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[true, false].map((answer) => (
        <label
          key={String(answer)}
          className="flex min-h-16 cursor-pointer items-center gap-4 rounded-md border border-border bg-card px-4 text-base transition has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
        >
          <input
            type="radio"
            name={question.id}
            disabled={disabled}
            checked={selected === answer}
            onChange={() => onChange({ type: 'TRUE_FALSE', answer })}
            className="h-5 w-5 accent-primary"
          />
          <span>{answer ? 'True' : 'False'}</span>
        </label>
      ))}
    </div>
  )
}
