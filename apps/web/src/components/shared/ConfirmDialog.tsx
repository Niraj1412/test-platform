import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}
