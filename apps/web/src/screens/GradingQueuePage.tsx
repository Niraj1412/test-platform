'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'

interface PendingAttempt {
  id: string
  taker: string
  email: string
  test: string
  section: string
  essayCount: number
  submittedAt: string
  status: 'PENDING' | 'IN_REVIEW' | 'GRADED'
}

const mockPending: PendingAttempt[] = [
  {
    id: 'a1',
    taker: 'Sam Taylor',
    email: 'sam.taylor@example.com',
    test: 'Mid-Term Physics',
    section: 'Section B — Descriptive',
    essayCount: 3,
    submittedAt: '2026-06-28 10:12',
    status: 'PENDING',
  },
  {
    id: 'a2',
    taker: 'Priya Shah',
    email: 'priya.shah@example.com',
    test: 'UPSC General Studies Mock #4',
    section: 'Essay + Answer Writing',
    essayCount: 2,
    submittedAt: '2026-06-28 09:44',
    status: 'PENDING',
  },
  {
    id: 'a3',
    taker: 'Noah Lee',
    email: 'noah.lee@example.com',
    test: 'CAT VARC Practice Set',
    section: 'Reading Comprehension Short Answer',
    essayCount: 4,
    submittedAt: '2026-06-27 17:55',
    status: 'IN_REVIEW',
  },
  {
    id: 'a4',
    taker: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    test: 'CLAT Full Mock — Series 2',
    section: 'Legal Reasoning Essay',
    essayCount: 1,
    submittedAt: '2026-06-27 16:03',
    status: 'PENDING',
  },
  {
    id: 'a5',
    taker: 'Ravi Menon',
    email: 'ravi.menon@example.com',
    test: 'Mid-Term Physics',
    section: 'Section B — Descriptive',
    essayCount: 3,
    submittedAt: '2026-06-27 14:30',
    status: 'GRADED',
  },
]

const statusConfig = {
  PENDING: { label: 'Pending', bg: 'bg-[#fff8e6] text-[#b45309] border-[#fde68a]' },
  IN_REVIEW: { label: 'In Review', bg: 'bg-primary-container/10 text-primary border-primary/20' },
  GRADED: { label: 'Graded', bg: 'bg-tertiary-container/10 text-tertiary border-tertiary/20' },
}

export function GradingQueuePage() {
  const [attempts, setAttempts] = useState(mockPending)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_REVIEW' | 'GRADED'>('ALL')
  const [grading, setGrading] = useState<PendingAttempt | null>(null)
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [toast, setToast] = useState('')

  const visible = filter === 'ALL' ? attempts : attempts.filter((a) => a.status === filter)

  const openGrade = (attempt: PendingAttempt) => {
    setGrading(attempt)
    setScore('')
    setFeedback('')
  }

  const submitGrade = () => {
    if (!grading) return
    setAttempts((prev) => prev.map((a) => (a.id === grading.id ? { ...a, status: 'GRADED' } : a)))
    setGrading(null)
    setToast(`${grading.taker}'s attempt graded successfully.`)
    window.setTimeout(() => setToast(''), 3500)
  }

  const pendingCount = attempts.filter((a) => a.status === 'PENDING').length
  const reviewCount = attempts.filter((a) => a.status === 'IN_REVIEW').length
  const gradedCount = attempts.filter((a) => a.status === 'GRADED').length

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message={toast} tone="success" />
        </div>
      )}

      <div className="flex h-screen flex-col overflow-y-auto bg-surface">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface/90 px-margin-desktop py-stack-lg backdrop-blur-sm">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-on-surface-variant">
              <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
              <MaterialIcon name="chevron_right" className="text-[14px]" />
              <span>Grading Queue</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Grading Queue</h2>
            <p className="text-sm text-on-surface-variant">
              Manually review short-answer and essay questions from taker submissions.
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-2">
              <MaterialIcon name="pending_actions" className="text-[18px] text-[#b45309]" />
              <span className="text-sm font-semibold text-[#b45309]">
                {pendingCount} attempt{pendingCount !== 1 ? 's' : ''} awaiting review
              </span>
            </div>
          )}
        </header>

        <div className="mx-auto w-full max-w-container-max p-margin-desktop">
          {/* Stats */}
          <div className="mb-margin-desktop grid grid-cols-3 gap-gutter">
            {[
              { label: 'Pending', value: pendingCount, icon: 'hourglass_empty', tone: 'text-[#b45309]', bg: 'bg-[#fffbeb] border-[#fde68a]' },
              { label: 'In Review', value: reviewCount, icon: 'rate_review', tone: 'text-primary', bg: 'bg-primary-container/10 border-primary/20' },
              { label: 'Graded', value: gradedCount, icon: 'check_circle', tone: 'text-tertiary', bg: 'bg-tertiary-container/10 border-tertiary/20' },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center gap-4 rounded-lg border p-stack-lg ${stat.bg}`}>
                <MaterialIcon name={stat.icon} className={`text-[32px] ${stat.tone}`} />
                <div>
                  <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
                  <p className="text-sm text-on-surface-variant">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="mb-6 flex gap-2">
            {(['ALL', 'PENDING', 'IN_REVIEW', 'GRADED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {tab === 'IN_REVIEW' ? 'In Review' : tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                <span className="ml-1.5 rounded-full bg-surface/30 px-1.5 py-0.5 text-[10px]">
                  {tab === 'ALL' ? attempts.length : attempts.filter((a) => a.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <MaterialIcon name="inbox" className="mb-3 text-[48px] text-on-surface-variant/30" />
                <p className="text-base font-semibold text-on-surface">No items in this queue</p>
                <p className="text-sm text-on-surface-variant">All caught up!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low/50">
                      {['Taker', 'Test', 'Section', 'Essays', 'Submitted', 'Status', 'Action'].map((h) => (
                        <th
                          key={h}
                          className={`px-stack-lg py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant ${h === 'Action' ? 'text-right' : ''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {visible.map((attempt) => {
                      const sc = statusConfig[attempt.status]
                      return (
                        <tr key={attempt.id} className="transition-colors hover:bg-surface-container-low/30">
                          <td className="px-stack-lg py-4">
                            <p className="text-sm font-semibold text-on-surface">{attempt.taker}</p>
                            <p className="text-xs text-on-surface-variant">{attempt.email}</p>
                          </td>
                          <td className="px-stack-lg py-4 text-sm text-on-surface">{attempt.test}</td>
                          <td className="px-stack-lg py-4 text-sm text-on-surface-variant">{attempt.section}</td>
                          <td className="px-stack-lg py-4 text-sm text-on-surface">
                            <span className="font-semibold">{attempt.essayCount}</span> question{attempt.essayCount !== 1 ? 's' : ''}
                          </td>
                          <td className="px-stack-lg py-4 text-sm text-on-surface-variant">{attempt.submittedAt}</td>
                          <td className="px-stack-lg py-4">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${sc.bg}`}>
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-stack-lg py-4 text-right">
                            {attempt.status !== 'GRADED' ? (
                              <button
                                onClick={() => openGrade(attempt)}
                                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
                              >
                                Grade
                              </button>
                            ) : (
                              <span className="flex items-center justify-end gap-1 text-xs text-tertiary">
                                <MaterialIcon name="check_circle" className="text-[14px]" fill />
                                Done
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grade modal */}
      <Modal title={`Grade: ${grading?.taker ?? ''}`} open={!!grading} onClose={() => setGrading(null)}>
        {grading && (
          <div className="space-y-5">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-sm">
              <p className="font-semibold text-on-surface">{grading.test}</p>
              <p className="text-on-surface-variant">{grading.section}</p>
              <p className="mt-1 text-on-surface-variant">
                {grading.essayCount} short-answer / essay question{grading.essayCount !== 1 ? 's' : ''} to review
              </p>
            </div>

            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
              <p className="mb-2 text-sm font-semibold text-on-surface">Sample Essay Response</p>
              <div className="space-y-1">
                <div className="h-3 w-full rounded bg-surface-variant" />
                <div className="h-3 w-5/6 rounded bg-surface-variant" />
                <div className="h-3 w-4/5 rounded bg-surface-variant" />
              </div>
            </div>

            <label className="block text-sm font-bold text-on-surface">
              Score
              <input
                type="number"
                min={0}
                max={100}
                placeholder="0 – 100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-2 h-[40px] w-full rounded-lg border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </label>

            <label className="block text-sm font-bold text-on-surface">
              Feedback note (optional)
              <textarea
                placeholder="Write feedback for the taker…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-outline-variant bg-surface p-3 text-sm font-normal text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </label>

            <div className="flex justify-end gap-3 border-t border-outline-variant pt-4">
              <Button variant="secondary" onClick={() => setGrading(null)}>Cancel</Button>
              <Button onClick={submitGrade} disabled={!score}>Submit Grade</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
