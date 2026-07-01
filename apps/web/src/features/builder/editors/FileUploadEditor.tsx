import type { FileUploadData } from '@quizforge/shared'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

export function FileUploadEditor({ value, onChange }: EditorProps) {
  const data = value as FileUploadData
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-sm">
        {(['pdf', 'image'] as const).map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.acceptedTypes.includes(type)}
              onChange={(event) => {
                const acceptedTypes = event.target.checked
                  ? [...data.acceptedTypes, type]
                  : data.acceptedTypes.filter((item) => item !== type)
                onChange({ ...data, acceptedTypes: acceptedTypes.length ? acceptedTypes : [type] })
              }}
              className="accent-primary"
            />
            {type.toUpperCase()}
          </label>
        ))}
      </div>
      <Input
        type="number"
        value={data.maxSizeMb}
        onChange={(event) => onChange({ ...data, maxSizeMb: Number(event.target.value) })}
        placeholder="Max size MB"
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
