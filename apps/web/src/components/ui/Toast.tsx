import { cn } from '../../utils/cn'

interface ToastProps {
  message: string
  tone?: 'success' | 'error' | 'info'
}

export function Toast({ message, tone = 'info' }: ToastProps) {
  return (
    <div
      className={cn(
        'rounded-md border px-4 py-3 text-sm shadow-panel',
        tone === 'success' && 'border-success/30 bg-success-soft text-success',
        tone === 'error' && 'border-danger/30 bg-danger-soft text-danger',
        tone === 'info' && 'border-border bg-card text-foreground'
      )}
    >
      {message}
    </div>
  )
}
