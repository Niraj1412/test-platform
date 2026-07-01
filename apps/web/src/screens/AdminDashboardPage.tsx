'use client'

import { useState } from 'react'
import { Archive, BookOpen, CheckCircle, ClipboardList, Clock, Settings, Shield, Users, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { AuthGuard } from '../components/layout/AuthGuard'

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbfaff]">
      <aside className="fixed hidden h-screen w-[280px] border-r border-border bg-[#f2f3ff] p-6 lg:block">
        <Link href="/admin" className="flex items-center gap-3 text-2xl font-extrabold text-primary">
          <Shield />
          QuizForge Admin
        </Link>
        <nav className="mt-10 space-y-3">
          <Button href="/admin" variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button href="/admin/users" variant="ghost" className="w-full justify-start">
            User Management
          </Button>
          <Button href="/admin/tests" variant="ghost" className="w-full justify-start">
            Test Management
          </Button>
          <Button href="/exams" variant="ghost" className="w-full justify-start">
            Exam Catalogue
          </Button>
          <Button href="/dashboard" variant="secondary" className="mt-8 w-full">
            Creator Studio
          </Button>
        </nav>
      </aside>
      <main className="lg:pl-[280px]">{children}</main>
    </div>
  )
}

interface CurationItem {
  id: string
  title: string
  creator: string
  category: string
  questions: number
  submittedAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const curationQueue: CurationItem[] = [
  { id: 'c1', title: 'JEE Main 2026 Mock #7', creator: 'Alex Morgan', category: 'Engineering', questions: 90, submittedAt: '2026-06-28', status: 'PENDING' },
  { id: 'c2', title: 'NEET UG Full Practice Series', creator: 'Priya Iyer', category: 'Medical', questions: 180, submittedAt: '2026-06-27', status: 'PENDING' },
  { id: 'c3', title: 'UPSC GS Prelims Set 12', creator: 'Rohan Das', category: 'Government', questions: 100, submittedAt: '2026-06-27', status: 'APPROVED' },
  { id: 'c4', title: 'CAT 2025 DILR Sprint', creator: 'Ananya Rao', category: 'Management', questions: 32, submittedAt: '2026-06-26', status: 'PENDING' },
  { id: 'c5', title: 'CLAT Full Mock — Series 5', creator: 'Mehul Shah', category: 'Law', questions: 150, submittedAt: '2026-06-25', status: 'REJECTED' },
]

const catColors: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700',
  Medical: 'bg-green-50 text-green-700',
  Government: 'bg-yellow-50 text-yellow-700',
  Management: 'bg-purple-50 text-purple-700',
  Law: 'bg-red-50 text-red-700',
  School: 'bg-gray-50 text-gray-700',
}

function AdminDashboardContent() {
  const [queue, setQueue] = useState(curationQueue)

  const approve = (id: string) =>
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item)))

  const reject = (id: string) =>
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item)))

  const pendingCount = queue.filter((i) => i.status === 'PENDING').length

  return (
    <AdminShell>
      <header className="border-b border-border bg-white px-8 py-9">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage users, tests, catalogue curation, and platform-wide settings.</p>
      </header>

      {/* Platform stats */}
      <div className="grid gap-6 p-8 lg:grid-cols-3">
        {[
          { title: 'Active users', value: '2,418', icon: Users },
          { title: 'Tests on platform', value: '386', icon: ClipboardList },
          { title: 'Archived tests', value: '41', icon: Archive },
        ].map((item) => (
          <Card key={item.title} className="p-6">
            <item.icon className="text-primary" />
            <div className="mt-5 text-4xl font-extrabold">{item.value}</div>
            <div className="text-muted-foreground">{item.title}</div>
          </Card>
        ))}
      </div>

      {/* Catalogue curation */}
      <div className="px-8 pb-8">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-primary" />
              <div>
                <h2 className="text-xl font-extrabold">Catalogue Curation Queue</h2>
                <p className="text-sm text-muted-foreground">Review and approve creator-submitted tests before they appear in the public exam catalogue.</p>
              </div>
            </div>
            {pendingCount > 0 && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                {pendingCount} pending
              </span>
            )}
          </div>

          {/* Curation workflow steps */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto rounded-lg bg-[#f8f8ff] p-4">
            {[
              { step: '1', label: 'Creator submits test', icon: ClipboardList },
              { step: '2', label: 'Admin reviews content', icon: Settings },
              { step: '3', label: 'Approve or Reject', icon: CheckCircle },
              { step: '4', label: 'Listed in catalogue', icon: BookOpen },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className="flex flex-none flex-col items-center gap-1 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {s.step}
                  </div>
                  <p className="w-24 text-[10px] font-semibold text-muted-foreground">{s.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px w-8 flex-none bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f8f8ff]">
                  {['Test Title', 'Creator', 'Category', 'Questions', 'Submitted', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8f8ff]">
                    <td className="px-4 py-3 font-semibold text-foreground">{item.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.creator}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${catColors[item.category] ?? 'bg-gray-50 text-gray-700'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.questions}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.submittedAt}</td>
                    <td className="px-4 py-3">
                      {item.status === 'PENDING' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-700">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-700">
                          <CheckCircle size={12} /> Approved
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approve(item.id)}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(item.id)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* System settings */}
      <div className="px-8 pb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Settings className="text-primary" />
            <h2 className="text-xl font-extrabold">System Settings Snapshot</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-border p-4">Max questions per test: 100</div>
            <div className="rounded-md border border-border p-4">Max duration: 180 minutes</div>
            <div className="rounded-md border border-border p-4">Allowed uploads: PDF, Image</div>
          </div>
        </Card>
      </div>
    </AdminShell>
  )
}

export function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminDashboardContent />
    </AuthGuard>
  )
}

export { AdminShell }
