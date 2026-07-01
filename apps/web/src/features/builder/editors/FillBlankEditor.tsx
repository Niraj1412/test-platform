import type { FillBlankData } from '@quizforge/shared'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

const markerRegex = /\{\{blank\}\}|\{\{blank_\d+\}\}/g

const syncBlanks = (template: string, existing: FillBlankData['blanks']) => {
  const matches = template.match(markerRegex) ?? []
  return matches.map((_, index) => {
    const id = `blank_${index + 1}`
    return (
      existing.find((blank) => blank.id === id) ?? {
        id,
        acceptedAnswers: [''],
        caseSensitive: false,
        matchType: 'exact' as const
      }
    )
  })
}

export function FillBlankEditor({ value, onChange }: EditorProps) {
  const data = value as FillBlankData

  return (
    <div className="space-y-4">
      <textarea
        value={data.template}
        onChange={(event) => {
          const template = event.target.value
          onChange({ ...data, template, blanks: syncBlanks(template, data.blanks) })
        }}
        className="min-h-28 w-full rounded-md border border-border bg-card p-3 outline-none focus:border-primary"
        placeholder="Type the prompt and insert {{blank}} where answers should go"
      />
      <div className="space-y-3">
        {data.blanks.map((blank) => (
          <div key={blank.id} className="rounded-md border border-border bg-card p-3">
            <div className="mb-2 text-sm font-bold">{blank.id}</div>
            <Input
              value={blank.acceptedAnswers.join(', ')}
              onChange={(event) =>
                onChange({
                  ...data,
                  blanks: data.blanks.map((item) =>
                    item.id === blank.id
                      ? {
                          ...item,
                          acceptedAnswers: event.target.value
                            .split(',')
                            .map((answer) => answer.trim())
                            .filter(Boolean)
                        }
                      : item
                  )
                })
              }
              placeholder="Accepted answers, comma separated"
            />
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={blank.caseSensitive}
                  onChange={(event) =>
                    onChange({
                      ...data,
                      blanks: data.blanks.map((item) =>
                        item.id === blank.id ? { ...item, caseSensitive: event.target.checked } : item
                      )
                    })
                  }
                  className="accent-primary"
                />
                Case sensitive
              </label>
              <select
                value={blank.matchType}
                onChange={(event) =>
                  onChange({
                    ...data,
                    blanks: data.blanks.map((item) =>
                      item.id === blank.id
                        ? { ...item, matchType: event.target.value as 'exact' | 'contains' }
                        : item
                    )
                  })
                }
                className="rounded-md border border-border bg-white px-2"
              >
                <option value="exact">Exact</option>
                <option value="contains">Contains</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
