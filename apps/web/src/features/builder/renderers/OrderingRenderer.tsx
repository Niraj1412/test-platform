import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { OrderingData } from '@quizforge/shared'
import type { RendererProps } from './types'

interface SortableRowProps {
  id: string
  text: string
  disabled?: boolean
}

function SortableRow({ id, text, disabled }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex min-h-12 items-center gap-3 rounded-md border border-border bg-card px-4"
    >
      <button
        type="button"
        className="text-muted-foreground"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span>{text}</span>
    </div>
  )
}

export function OrderingRenderer({ question, value, onChange, disabled }: RendererProps) {
  const data = question.questionData as OrderingData
  const fallbackIds = data.items.map((item) => item.id)
  const orderedIds = value?.type === 'ORDERING' && value.orderedIds.length ? value.orderedIds : fallbackIds
  const itemById = new Map(data.items.map((item) => [item.id, item]))

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) {
      return
    }
    const oldIndex = orderedIds.indexOf(String(event.active.id))
    const newIndex = orderedIds.indexOf(String(event.over.id))
    onChange({ type: 'ORDERING', orderedIds: arrayMove(orderedIds, oldIndex, newIndex) })
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {orderedIds.map((id) => (
            <SortableRow key={id} id={id} text={itemById.get(id)?.text ?? id} disabled={disabled} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
