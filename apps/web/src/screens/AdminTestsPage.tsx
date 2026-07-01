'use client'

import { Archive, Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Toast } from '../components/ui/Toast'
import { dashboardRows } from './mockData'
import { AdminShell } from './AdminDashboardPage'

export function AdminTestsPage() {
  const [toast, setToast] = useState('')

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message={toast} tone="success" />
        </div>
      )}
      <header className="border-b border-border bg-white px-8 py-9">
        <h1 className="text-3xl font-extrabold">Test Management</h1>
        <p className="mt-2 text-muted-foreground">View, archive, delete, and inspect test logs.</p>
      </header>
      <div className="p-8">
        <Card className="overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f0f1ff] text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Test</th>
                <th className="px-6 py-4">Creator</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attempts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardRows.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-6 py-4 font-semibold">{row.name}</td>
                  <td className="px-6 py-4">Alex Morgan</td>
                  <td className="px-6 py-4">
                    <Badge tone={row.status === 'PUBLISHED' ? 'blue' : 'gray'}>{row.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{row.takers}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button href="/dashboard/tests/demo-test/results" variant="secondary" icon={<Eye size={16} />}>
                        View
                      </Button>
                      <Button variant="secondary" icon={<Archive size={16} />} onClick={() => setToast(`${row.name} archived in demo mode.`)}>
                        Archive
                      </Button>
                      <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setToast(`${row.name} deleted in demo mode.`)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminShell>
  )
}
