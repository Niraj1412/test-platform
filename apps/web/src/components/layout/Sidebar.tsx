'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MaterialIcon } from '../ui/MaterialIcon'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../stores/authStore'

const items = [
  { to: '/dashboard', label: 'My Tests', icon: 'quiz' },
  { to: '/dashboard/question-bank', label: 'Question Bank', icon: 'database' },
  { to: '/dashboard/grading', label: 'Grading Queue', icon: 'rate_review' },
  { to: '/dashboard/tests/demo-test/results', label: 'Results', icon: 'analytics' },
  { to: '/dashboard/tests/demo-test/settings', label: 'Settings', icon: 'settings' },
  { to: '/exams', label: 'Exam Catalogue', icon: 'menu_book' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="fixed left-0 top-0 z-20 hidden h-screen w-[240px] flex-col border-r border-outline-variant bg-surface-container-lowest py-stack-lg text-sm text-primary lg:flex">
      <div className="mb-8 px-stack-lg">
        <h1 className="text-xl font-bold text-primary">QuizForge</h1>
        <p className="mt-1 text-xs text-on-surface-variant">Creator Studio</p>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-stack-sm">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to))
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-stack-md py-3 transition-colors',
                active
                  ? 'border-r-4 border-primary bg-primary-container/10 font-bold text-primary opacity-80'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <MaterialIcon name={item.icon} fill={active} />
              {item.label}
            </Link>
          )
        })}
      </div>
      <div className="mt-auto border-t border-outline-variant px-stack-lg pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-on-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-on-surface">{user?.name ?? '—'}</p>
            <p className="truncate text-xs text-on-surface-variant">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex-shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <MaterialIcon name="logout" className="text-[18px]" />
          </button>
        </div>
      </div>
    </nav>
  )
}
