'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { UserRole } from '@quizforge/shared'
import { useAuthStore } from '../../stores/authStore'
import { MaterialIcon } from '../ui/MaterialIcon'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-surface">
      <div className="flex items-center gap-3">
        <MaterialIcon name="quiz" className="text-[36px] text-primary" fill />
        <span className="text-3xl font-bold text-primary">QuizForge</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  )
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [hydrated, setHydrated] = useState(false)

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const isAuthenticated = Boolean(user && accessToken)

    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`)
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to their appropriate home
      router.replace(user?.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }, [hydrated, user, accessToken, router, pathname, requiredRole])

  if (!hydrated) return <LoadingScreen />

  const isAuthenticated = Boolean(user && accessToken)
  if (!isAuthenticated) return <LoadingScreen />

  if (requiredRole && user?.role !== requiredRole) return <LoadingScreen />

  return <>{children}</>
}
