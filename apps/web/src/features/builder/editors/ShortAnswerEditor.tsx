import type { ShortAnswerData } from '@quizforge/shared'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

export function ShortAnswerEditor({ value, onChange }: EditorProps) {
  const data = value as ShortAnswerData
  return (
    <div className="space-y-3">
      <Input
        type="number"
        value={data.maxLength ?? ''}
        placeholder="Max length"
        onChange={(event) =>
          onChange({ ...data, maxLength: event.target.value ? Number(event.target.value) : undefined })
        }
      />
      <textarea
        value={data.rubric ?? ''}
        onChange={(event) => onChange({ ...data, rubric: event.target.value })}
        className="min-h-24 w-full rounded-md border border-border bg-card p-3 outline-none focus:border-primary"
        placeholder="Manual grading rubric"
      />
    </div>
  )
}
