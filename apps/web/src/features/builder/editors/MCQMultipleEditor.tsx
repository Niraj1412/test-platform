import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { MCQMultipleData } from '@quizforge/shared'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

function OptionRow({
  id,
  text,
  checked,
  canDelete,
  onText,
  onCorrect,
  onDelete
}: {
  id: string
  text: string
  checked: boolean
  canDelete: boolean
  onText: (text: string) => void
  onCorrect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2"
    >
      <button type="button" className="text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical size={18} />
      </button>
      <input type="checkbox" checked={checked} onChange={onCorrect} className="h-5 w-5 accent-primary" />
      <Input value={text} onChange={(event) => onText(event.target.value)} />
      <Button
        type="button"
        variant="ghost"
        className="h-10 w-10 px-0"
        onClick={onDelete}
        disabled={!canDelete}
      >
        <Trash2 size={17} />
      </Button>
    </div>
  )
}

export function MCQMultipleEditor({ value, onChange }: EditorProps) {
  const data = value as MCQMultipleData
  const updateOptions = (options: MCQMultipleData['options']) => onChange({ ...data, options })
  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) {
      return
    }
    const ids = data.options.map((option) => option.id)
    updateOptions(arrayMove(data.options, ids.indexOf(String(event.active.id)), ids.indexOf(String(event.over.id))))
  }

  return (
    <div className="space-y-4">
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={data.options.map((option) => option.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {data.options.map((option) => (
              <OptionRow
                key={option.id}
                id={option.id}
                text={option.text}
                checked={option.isCorrect}
                canDelete={data.options.length > 2}
                onText={(text) =>
                  updateOptions(data.options.map((item) => (item.id === option.id ? { ...item, text } : item)))
                }
                onCorrect={() =>
                  updateOptions(
                    data.options.map((item) =>
                      item.id === option.id ? { ...item, isCorrect: !item.isCorrect } : item
                    )
                  )
                }
                onDelete={() => updateOptions(data.options.filter((item) => item.id !== option.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.partialCredit}
          onChange={(event) => onChange({ ...data, partialCredit: event.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        Partial credit
      </label>
      <Button
        type="button"
        variant="ghost"
        icon={<Plus size={18} />}
        onClick={() =>
          updateOptions([
            ...data.options,
            { id: crypto.randomUUID(), text: `Option ${data.options.length + 1}`, isCorrect: false }
          ])
        }
      >
        Add Option
      </Button>
    </div>
  )
}
