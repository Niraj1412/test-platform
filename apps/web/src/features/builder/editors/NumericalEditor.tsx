import type { NumericalData } from '@quizforge/shared'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

export function NumericalEditor({ value, onChange }: EditorProps) {
  const data = value as NumericalData
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        type="number"
        value={data.correctAnswer}
        onChange={(event) => onChange({ ...data, correctAnswer: Number(event.target.value) })}
        placeholder="Correct answer"
      />
      <Input
        type="number"
        value={data.tolerance}
        onChange={(event) => onChange({ ...data, tolerance: Number(event.target.value) })}
        placeholder="Tolerance"
      />
      <Input
        value={data.unit ?? ''}
        onChange={(event) => onChange({ ...data, unit: event.target.value || undefined })}
        placeholder="Unit"
      />
    </div>
  )
}
