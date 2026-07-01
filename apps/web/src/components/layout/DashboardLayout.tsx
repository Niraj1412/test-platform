import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { AuthGuard } from './AuthGuard'

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface text-on-surface lg:flex">
        <Sidebar />
        <main className="min-w-0 flex-1 lg:ml-[240px]">{children}</main>
      </div>
    </AuthGuard>
  )
}
