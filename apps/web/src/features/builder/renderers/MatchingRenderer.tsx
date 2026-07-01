import type { MatchingData } from '@quizforge/shared'
import type { RendererProps } from './types'

interface SanitisedMatchingData {
  type: 'MATCHING'
  pairs: Array<{ id: string; prompt: string; match?: string }>
  matches?: Array<{ id: string; text: string }>
}

export function MatchingRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as MatchingData | SanitisedMatchingData
  const responsePairs = value?.type === 'MATCHING' ? value.pairs : {}
  const options =
    'matches' in data && data.matches
      ? data.matches
      : data.pairs.map((pair) => ({ id: pair.id, text: 'match' in pair ? pair.match : pair.prompt }))

  return (
    <div className="space-y-3">
      {data.pairs.map((pair) => (
        <div key={pair.id} className="grid gap-3 rounded-md border border-border bg-card p-3 sm:grid-cols-2">
          <div className="font-medium">{pair.prompt}</div>
          <select
            disabled={disabled}
            value={responsePairs[pair.id] ?? ''}
            onChange={(event) =>
              onChange({ type: 'MATCHING', pairs: { ...responsePairs, [pair.id]: event.target.value } })
            }
            className="h-10 rounded-md border border-border bg-white px-3 outline-none focus:border-primary"
          >
            <option value="">Select match</option>
            {options.map((option) => (
              <option key={option.id} value={option.text}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
