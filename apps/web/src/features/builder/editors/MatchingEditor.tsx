import { Plus, Trash2 } from 'lucide-react'
import type { MatchingData } from '@quizforge/shared'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

export function MatchingEditor({ value, onChange }: EditorProps) {
  const data = value as MatchingData
  return (
    <div className="space-y-3">
      {data.pairs.map((pair) => (
        <div key={pair.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input
            value={pair.prompt}
            onChange={(event) =>
              onChange({
                ...data,
                pairs: data.pairs.map((item) =>
                  item.id === pair.id ? { ...item, prompt: event.target.value } : item
                )
              })
            }
            placeholder="Prompt"
          />
          <Input
            value={pair.match}
            onChange={(event) =>
              onChange({
                ...data,
                pairs: data.pairs.map((item) =>
                  item.id === pair.id ? { ...item, match: event.target.value } : item
                )
              })
            }
            placeholder="Match"
          />
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-11 px-0"
            disabled={data.pairs.length <= 2}
            onClick={() => onChange({ ...data, pairs: data.pairs.filter((item) => item.id !== pair.id) })}
          >
            <Trash2 size={17} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        icon={<Plus size={18} />}
        onClick={() =>
          onChange({
            ...data,
            pairs: [...data.pairs, { id: crypto.randomUUID(), prompt: 'New prompt', match: 'New match' }]
          })
        }
      >
        Add Pair
      </Button>
    </div>
  )
}
