import type { FillBlankData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function FillBlankRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as FillBlankData
  const answers = value?.type === 'FILL_BLANK' ? value.blankAnswers : {}
  const parts = data.template.split(/(\{\{blank_\d+\}\}|\{\{blank\}\})/g)
  const renderedParts = parts.map((part, index) => {
    const isBlank = /^\{\{blank/.test(part)
    if (!isBlank) {
      return { kind: 'text' as const, key: `${part}-${index}`, text: part }
    }
    const blankIndex = parts.slice(0, index + 1).filter((item) => /^\{\{blank/.test(item)).length - 1
    return {
      kind: 'blank' as const,
      key: data.blanks[blankIndex]?.id ?? `blank-${index}`,
      blank: data.blanks[blankIndex],
      label: blankIndex + 1
    }
  })

  return (
    <div className="rounded-md border border-border bg-card p-5 text-lg leading-10">
      {renderedParts.map((part) => {
        if (part.kind === 'text') {
          return <span key={part.key}>{part.text}</span>
        }
        if (!part.blank) {
          return null
        }
        const blank = part.blank
        return (
          <input
            key={blank.id}
            disabled={disabled}
            value={answers[blank.id] ?? ''}
            onChange={(event) =>
              onChange({
                type: 'FILL_BLANK',
                blankAnswers: { ...answers, [blank.id]: event.target.value }
              })
            }
            className="mx-2 h-9 min-w-28 border-b-2 border-foreground bg-transparent px-2 text-center outline-none focus:border-primary"
            aria-label={`Blank ${part.label}`}
          />
        )
      })}
    </div>
  )
}
