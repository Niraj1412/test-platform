import type { FileUploadData } from '@quizforge/shared'
import type { RendererProps } from './types'

export function FileUploadRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as FileUploadData
  const fileName = value?.type === 'FILE_UPLOAD' ? value.fileName : null
  return (
    <label className="block rounded-md border border-dashed border-border bg-card p-6 text-center">
      <input
        type="file"
        disabled={disabled}
        accept={data.acceptedTypes.includes('pdf') ? '.pdf,image/*' : 'image/*'}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) {
            return
          }
          onChange({ type: 'FILE_UPLOAD', fileUrl: null, fileName: file.name })
        }}
      />
      <span className="font-semibold text-primary">{fileName ?? 'Choose file'}</span>
      <span className="mt-2 block text-sm text-muted-foreground">
        PDF/image up to {data.maxSizeMb}MB
      </span>
    </label>
  )
}
