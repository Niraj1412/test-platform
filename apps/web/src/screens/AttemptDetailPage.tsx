'use client'

import { Save } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'

const rows = [
  { section: 'Quantitative', score: '28 / 40' },
  { section: 'Verbal', score: '22 / 30' },
  { section: 'Essay', score: 'Pending / 30' }
]

export function AttemptDetailPage() {
  const [isGradeOpen, setIsGradeOpen] = useState(false)
  const [score, setScore] = useState('22')
  const [feedback, setFeedback] = useState('Clear reasoning with minor grammar issues.')
  const [toast, setToast] = useState('')

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message={toast} tone="success" />
        </div>
      )}
      <header className="min-h-[125px] border-b border-slate-900/70 bg-[#fbfaff] px-8 py-9 lg:px-12">
        <h1 className="text-3xl font-extrabold">Attempt Detail: Sam Taylor</h1>
        <p className="mt-2 text-lg text-muted-foreground">Answer sheet, section breakdown, and manual grading.</p>
      </header>
      <div className="grid gap-8 px-8 py-10 lg:grid-cols-[360px_1fr] lg:px-12">
        <Card className="p-6">
          <h2 className="text-xl font-extrabold">Section Breakdown</h2>
          <div className="mt-5 space-y-3">
            {rows.map((row) => (
              <div key={row.section} className="flex justify-between rounded-md border border-border p-3">
                <span>{row.section}</span>
                <span className="font-bold">{row.score}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-extrabold">Per-Question Review</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Q1 Multiple Choice</div>
                <Badge tone="blue">Correct</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Taker answer: Behind schedule and under budget.</p>
              <p className="text-sm text-muted-foreground">Correct answer: Behind schedule and under budget.</p>
            </div>
            <div className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Q2 Fill in the Blank</div>
                <Badge tone="blue">Correct</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Taker answer: 12</p>
              <p className="text-sm text-muted-foreground">Accepted answer: 12</p>
            </div>
            <div className="rounded-md border border-warning/40 bg-warning-soft p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Q3 Essay Response</div>
                <Badge tone="orange">Manual Review</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Taker answer: Project controls should balance time, cost, and scope while communicating tradeoffs clearly.
              </p>
              <Button className="mt-4" onClick={() => setIsGradeOpen(true)}>
                Grade
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Modal title="Grade Subjective Answer" open={isGradeOpen} onClose={() => setIsGradeOpen(false)}>
        <div className="space-y-4">
          <label className="block text-sm font-bold">
            Score out of 30
            <Input className="mt-2" type="number" value={score} onChange={(event) => setScore(event.target.value)} />
          </label>
          <label className="block text-sm font-bold">
            Feedback note
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-border bg-card p-3 outline-none"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
          </label>
          <div className="flex justify-end">
            <Button
              icon={<Save size={18} />}
              onClick={() => {
                setIsGradeOpen(false)
                setToast(`Essay graded ${score}/30.`)
              }}
            >
              Save Grade
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
