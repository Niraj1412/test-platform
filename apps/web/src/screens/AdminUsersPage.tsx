'use client'

import { Plus, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { AdminShell } from './AdminDashboardPage'

const initialUsers = [
  { name: 'Alex Morgan', email: 'alex@quizforge.local', role: 'CREATOR', status: 'ACTIVE' },
  { name: 'Sam Taylor', email: 'sam@example.com', role: 'TAKER', status: 'ACTIVE' },
  { name: 'Nora Admin', email: 'admin@quizforge.local', role: 'ADMIN', status: 'ACTIVE' }
]

export function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [name, setName] = useState('New Creator')
  const [toast, setToast] = useState('')

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message={toast} tone="success" />
        </div>
      )}
      <header className="flex items-center justify-between border-b border-border bg-white px-8 py-9">
        <div>
          <h1 className="text-3xl font-extrabold">User Management</h1>
          <p className="mt-2 text-muted-foreground">Filter users by role and create creator accounts.</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setIsCreateOpen(true)}>
          Create Creator
        </Button>
      </header>
      <div className="p-8">
        <Card className="overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f0f1ff] text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-t border-border">
                  <td className="px-6 py-4 font-semibold">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <Badge tone="blue">{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" icon={<ShieldOff size={16} />} onClick={() => setToast(`${user.name} suspended in demo mode.`)}>
                      Suspend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <Modal title="Create Creator Account" open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="space-y-4">
          <label className="block text-sm font-bold">
            Creator name
            <Input className="mt-2" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <Button
            className="w-full"
            onClick={() => {
              setUsers((current) => [
                { name, email: `${name.toLowerCase().replaceAll(' ', '.')}@quizforge.local`, role: 'CREATOR', status: 'ACTIVE' },
                ...current
              ])
              setIsCreateOpen(false)
            }}
          >
            Create Account
          </Button>
        </div>
      </Modal>
    </AdminShell>
  )
}
