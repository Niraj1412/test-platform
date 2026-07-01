import type { NumericalData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function NumericalRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as NumericalData
  const current = value?.type === 'NUMERICAL' && typeof value.value === 'number' ? String(value.value) : ''
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={current}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            type: 'NUMERICAL',
            value: event.target.value === '' ? null : Number(event.target.value),
            unit: data.unit
          })
        }
        className="h-12 w-full max-w-xs rounded-md border border-border bg-card px-4 outline-none focus:border-primary"
        placeholder="Enter number"
      />
      {data.unit && <span className="text-sm font-medium text-muted-foreground">{data.unit}</span>}
    </div>
  )
}
