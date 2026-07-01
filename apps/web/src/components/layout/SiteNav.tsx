'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MaterialIcon } from '../ui/MaterialIcon'
import { useAuthStore } from '../../stores/authStore'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/exams', label: 'Exams' },
]

export function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  const isAuthenticated = hydrated && Boolean(user)

  const navLinks = [
    ...publicLinks,
    ...(isAuthenticated
      ? [
          { href: '/dashboard', label: 'Creator' },
          ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin' }] : []),
        ]
      : []),
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : ''

  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant bg-surface shadow-sm">
      <div className="mx-auto flex h-[64px] w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-stack-md">
          <MaterialIcon name="quiz" className="text-[28px] text-primary" fill />
          <span className="text-2xl font-bold text-primary">QuizForge</span>
        </Link>

        <div className="hidden items-center gap-gutter text-sm md:flex">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? 'font-semibold text-primary'
                    : 'rounded-lg px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary'
                }
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-stack-sm">
          {!hydrated ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-surface-container-low" />
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-on-primary">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-on-surface md:block">{user!.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-container/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-surface-tint"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
