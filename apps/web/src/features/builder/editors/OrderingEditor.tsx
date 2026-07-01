import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { OrderingData } from '@quizforge/shared'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { EditorProps } from './types'

function ItemRow({
  id,
  text,
  canDelete,
  onText,
  onDelete
}: {
  id: string
  text: string
  canDelete: boolean
  onText: (text: string) => void
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
      <Input value={text} onChange={(event) => onText(event.target.value)} />
      <Button
        type="button"
        variant="ghost"
        className="h-10 w-10 px-0"
        disabled={!canDelete}
        onClick={onDelete}
      >
        <Trash2 size={17} />
      </Button>
    </div>
  )
}

export function OrderingEditor({ value, onChange }: EditorProps) {
  const data = value as OrderingData
  const update = (items: OrderingData['items']) =>
    onChange({ ...data, items: items.map((item, index) => ({ ...item, correctPosition: index })) })

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) {
      return
    }
    const ids = data.items.map((item) => item.id)
    update(arrayMove(data.items, ids.indexOf(String(event.active.id)), ids.indexOf(String(event.over.id))))
  }

  return (
    <div className="space-y-3">
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={data.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {data.items.map((item) => (
              <ItemRow
                key={item.id}
                id={item.id}
                text={item.text}
                canDelete={data.items.length > 2}
                onText={(text) =>
                  update(data.items.map((entry) => (entry.id === item.id ? { ...entry, text } : entry)))
                }
                onDelete={() => update(data.items.filter((entry) => entry.id !== item.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="ghost"
        icon={<Plus size={18} />}
        onClick={() =>
          update([
            ...data.items,
            { id: crypto.randomUUID(), text: `Step ${data.items.length + 1}`, correctPosition: data.items.length }
          ])
        }
      >
        Add Item
      </Button>
    </div>
  )
}
