'use client'

import { Database, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'

const initialItems = [
  { type: 'MCQ_SINGLE', title: 'Derivative of x^2', tags: ['calculus', 'easy'] },
  { type: 'FILL_BLANK', title: 'Capital city recall', tags: ['geography'] },
  { type: 'NUMERICAL', title: 'Tolerance-based speed calculation', tags: ['math'] }
]

export function QuestionBankPage() {
  const [items, setItems] = useState(initialItems)
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [title, setTitle] = useState('New reusable question')
  const [toast, setToast] = useState('')

  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) {
      return items
    }

    return items.filter((item) =>
      [item.title, item.type, ...item.tags].some((value) => value.toLowerCase().includes(cleanQuery))
    )
  }, [items, query])

  const createQuestion = () => {
    const cleanTitle = title.trim() || 'Untitled reusable question'
    setItems((current) => [
      {
        type: 'MCQ_SINGLE',
        title: cleanTitle,
        tags: ['demo']
      },
      ...current
    ])
    setIsCreateOpen(false)
    setToast(`${cleanTitle} was added to the local question bank.`)
  }

  return (
    <DashboardLayout>
      <header className="flex min-h-[125px] items-center justify-between border-b border-slate-900/70 bg-[#fbfaff] px-8 lg:px-12">
        <div>
          <h1 className="text-3xl font-extrabold">Question Bank</h1>
          <p className="mt-2 text-lg text-muted-foreground">Reusable questions across tests and sections.</p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setIsCreateOpen(true)}>
          New Question
        </Button>
      </header>
      <div className="px-8 py-10 lg:px-12">
        {toast && (
          <div className="fixed right-6 top-6 z-40">
            <Toast message={toast} tone="success" />
          </div>
        )}

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            className="pl-10"
            placeholder="Search questions, tags, and types"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={`${item.type}-${item.title}`} className="p-5">
              <Database size={24} className="text-primary" />
              <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
              <Badge tone="blue" className="mt-3">
                {item.type}
              </Badge>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal title="Add Demo Question" open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="space-y-5">
          <label className="block text-sm font-bold">
            Question title
            <Input className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button icon={<Plus size={18} />} onClick={createQuestion}>
              Add Question
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
