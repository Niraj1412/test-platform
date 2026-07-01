import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4">
      <div className="w-full max-w-lg rounded-md border border-border bg-card shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button variant="ghost" className="h-9 w-9 px-0" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
