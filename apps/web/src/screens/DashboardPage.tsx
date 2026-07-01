'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { testsApi } from '../api/tests.api'

const stats = [
  { label: 'Total Tests', value: '24', note: '+3 this week', icon: 'description' },
  { label: 'Published', value: '18', note: 'Active', icon: 'public' },
  { label: 'Total Takers', value: '1,492', note: '+12%', icon: 'groups' },
  { label: 'Avg Score', value: '76%', note: 'Across all tests', icon: 'trending_up' }
]

const rowIcons: Record<string, string> = {
  JS: 'code',
  UX: 'design_services',
  PY: 'terminal',
  SQL: 'database',
  QF: 'quiz'
}

export function DashboardPage() {
  const router = useRouter()
  const [rows, setRows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [showPublishedOnly, setShowPublishedOnly] = useState(false)
  const [title, setTitle] = useState('Demo Certification Test')
  const [module, setModule] = useState('Sample Module')
  const [description, setDescription] = useState('A structured exam for onboarding candidates.')
  const [instructions, setInstructions] = useState('Read every section carefully before answering.')
  const [passingScore, setPassingScore] = useState('40')
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false)
  const [maxAttempts, setMaxAttempts] = useState('1')
  const [showResultsInstantly, setShowResultsInstantly] = useState(true)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [timingMode, setTimingMode] = useState<'GLOBAL' | 'PER_SECTION'>('GLOBAL')
  const [duration, setDuration] = useState('90')
  const [allowBacktracking, setAllowBacktracking] = useState(true)
  const [toast, setToast] = useState('')

  const fetchTests = () => {
    setIsLoading(true)
    testsApi.list(1, 100)
      .then((res) => {
        setRows(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const visibleRows = useMemo(
    () => rows.filter((row) => !showPublishedOnly || row.status === 'PUBLISHED'),
    [rows, showPublishedOnly]
  )

  const createDemoTest = async () => {
    const cleanTitle = title.trim() || 'Untitled Test'
    try {
      const newTest = await testsApi.create({
        title: cleanTitle,
        description,
        instructions,
        passingScore: Number(passingScore) || 40,
        negativeMarkingGlobal: 0,
        timingMode,
        globalDurationMins: timingMode === 'GLOBAL' ? Number(duration) : undefined,
        allowMultipleAttempts,
        maxAttempts: allowMultipleAttempts ? Number(maxAttempts) : 1,
        showResultsInstantly,
        showCorrectAnswers,
        allowSectionBacktrack: allowBacktracking,
        shuffleQuestions: false,
        requireFullscreen: false
      })
      setIsCreateOpen(false)
      setToast(`${cleanTitle} was saved as a draft. Opening Test Builder.`)
      window.setTimeout(() => router.push(`/dashboard/tests/${newTest.id}/build`), 350)
    } catch (err: any) {
      setToast(err.response?.data?.error?.message || err.message || 'Failed to create test.')
    }
  }

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
            <h2 className="text-2xl font-bold text-on-surface">Good morning, Alex</h2>
            <p className="text-sm text-on-surface-variant">Here&apos;s what&apos;s happening with your tests today.</p>
          </div>
          <button
            className="flex h-[48px] items-center gap-2 rounded bg-primary px-6 text-sm font-medium text-on-primary shadow-sm transition-opacity hover:opacity-90"
            onClick={() => setIsCreateOpen(true)}
          >
            <MaterialIcon name="add" />
            New Test
          </button>
        </header>

        <div className="mx-auto w-full max-w-container-max p-margin-desktop">
          {/* Grading queue callout */}
          <div className="mb-gutter flex items-center justify-between gap-4 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-stack-lg py-4">
            <div className="flex items-center gap-3">
              <MaterialIcon name="rate_review" className="text-[24px] text-[#b45309]" />
              <div>
                <p className="text-sm font-bold text-[#92400e]">3 attempts awaiting manual grading</p>
                <p className="text-xs text-[#b45309]">Short-answer and essay questions need your review before results are released.</p>
              </div>
            </div>
            <Link
              href="/dashboard/grading"
              className="flex-none rounded-lg bg-[#b45309] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              Open Grading Queue
            </Link>
          </div>

          <div className="mb-margin-desktop grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-stack-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
                  <MaterialIcon name={stat.icon} className="text-secondary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-on-surface">{stat.value}</h3>
                  <span className="rounded-full bg-primary-container/10 px-2 py-0.5 text-xs text-primary">{stat.note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low/50 px-stack-lg py-stack-md">
              <h3 className="text-lg font-bold text-on-surface">Recent Tests</h3>
              <button
                className="flex h-[32px] items-center gap-1 rounded border border-outline-variant px-3 text-sm font-medium transition-colors hover:bg-surface-container-high"
                onClick={() => setShowPublishedOnly((current) => !current)}
              >
                <MaterialIcon name="filter_list" className="text-sm" />
                {showPublishedOnly ? 'Published' : 'Filter'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-lowest">
                    {['Name', 'Status', 'Takers', 'Created', 'Actions'].map((heading) => (
                      <th key={heading} className={`px-stack-lg py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant ${heading === 'Actions' ? 'text-right' : ''}`}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {visibleRows.map((row) => {
                    const published = row.status === 'PUBLISHED'
                    return (
                      <tr key={row.id} className="transition-colors hover:bg-surface-container-low/30">
                        <td className="px-stack-lg py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded ${published ? 'bg-primary-container/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                              <MaterialIcon name={rowIcons[row.icon] ?? 'quiz'} className="text-sm" />
                            </div>
                            <div>
                              <Link href={`/dashboard/tests/${row.id}/build`} className="text-sm font-medium text-on-surface hover:text-primary">
                                {row.title}
                              </Link>
                              <p className="text-xs text-on-surface-variant line-clamp-1">{row.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-stack-lg py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${published ? 'border border-primary/20 bg-[#EFF6FF] text-primary' : row.status === 'CLOSED' ? 'border border-outline-variant bg-surface-container text-on-surface-variant' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-stack-lg py-4 text-sm text-on-surface-variant">{row._count?.attempts ?? 0}</td>
                        <td className="px-stack-lg py-4 text-sm text-on-surface-variant">{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td className="px-stack-lg py-4 text-right">
                          <button className="p-1 text-on-surface-variant transition-colors hover:text-primary" onClick={() => {
                            if (published && row.accessCode) {
                              navigator.clipboard.writeText(`${window.location.origin}/t/${row.accessCode}`)
                              setToast('Access link copied to clipboard!')
                            } else {
                              setToast('Test options available inside editor.')
                            }
                          }}>
                            <MaterialIcon name={published ? 'link' : 'more_vert'} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-stack-lg py-stack-md">
              <p className="text-sm text-on-surface-variant">Showing 1 to {visibleRows.length} of {rows.length} tests</p>
              <div className="flex gap-1">
                <button disabled className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant opacity-50">
                  <MaterialIcon name="chevron_left" className="text-sm" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-high">
                  <MaterialIcon name="chevron_right" className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Test Setup" open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="max-h-[76vh] space-y-5 overflow-y-auto pr-2">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold">
              Test title
              <Input className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="block text-sm font-bold">
              Module label
              <Input className="mt-2" value={module} onChange={(event) => setModule(event.target.value)} />
            </label>
          </div>
          <label className="block text-sm font-bold">
            Description
            <Input className="mt-2" value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="block text-sm font-bold">
            Instructions
            <textarea className="mt-2 min-h-24 w-full rounded-md border border-border bg-card p-3 font-normal outline-none" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-bold">
              Passing score %
              <Input className="mt-2" type="number" value={passingScore} onChange={(event) => setPassingScore(event.target.value)} />
            </label>
            <label className="block text-sm font-bold">
              Start datetime
              <Input className="mt-2" type="datetime-local" defaultValue="2026-06-23T09:00" />
            </label>
            <label className="block text-sm font-bold">
              End datetime
              <Input className="mt-2" type="datetime-local" defaultValue="2026-06-23T18:00" />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-border p-3">
              <input type="checkbox" checked={allowMultipleAttempts} onChange={(event) => setAllowMultipleAttempts(event.target.checked)} className="accent-primary" />
              Allow multiple attempts
            </label>
            <label className="block text-sm font-bold">
              Max attempts
              <Input className="mt-2" type="number" disabled={!allowMultipleAttempts} value={maxAttempts} onChange={(event) => setMaxAttempts(event.target.value)} />
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border p-3">
              <input type="checkbox" checked={showResultsInstantly} onChange={(event) => setShowResultsInstantly(event.target.checked)} className="accent-primary" />
              Show results instantly
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border p-3">
              <input type="checkbox" checked={showCorrectAnswers} onChange={(event) => setShowCorrectAnswers(event.target.checked)} className="accent-primary" />
              Show correct answers after
            </label>
          </div>
          <div>
            <div className="text-sm font-bold">Timed</div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md border border-border p-3">
                <input type="radio" name="timing" checked={timingMode === 'GLOBAL'} onChange={() => setTimingMode('GLOBAL')} className="accent-primary" />
                Global timer
              </label>
              <label className="flex items-center gap-3 rounded-md border border-border p-3">
                <input type="radio" name="timing" checked={timingMode === 'PER_SECTION'} onChange={() => setTimingMode('PER_SECTION')} className="accent-primary" />
                Per-section timers
              </label>
            </div>
          </div>
          {timingMode === 'GLOBAL' && (
            <label className="block text-sm font-bold">
              Total minutes
              <Input className="mt-2" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-md border border-border p-3">
            <input type="checkbox" checked={allowBacktracking} onChange={(event) => setAllowBacktracking(event.target.checked)} className="accent-primary" />
            Section backtracking allowed
          </label>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={createDemoTest}>Save Draft and Build</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
