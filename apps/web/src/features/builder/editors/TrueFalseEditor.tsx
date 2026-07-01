import type { TrueFalseData } from '@quizforge/shared'
import type { EditorProps } from './types'

export function TrueFalseEditor({ value, onChange }: EditorProps) {
  const data = value as TrueFalseData
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((answer) => (
        <label key={String(answer)} className="rounded-md border border-border bg-card p-3">
          <input
            type="radio"
            checked={data.correctAnswer === answer}
            onChange={() => onChange({ ...data, correctAnswer: answer })}
            className="mr-2 accent-primary"
          />
          {answer ? 'True' : 'False'}
        </label>
      ))}
    </div>
  )
}
