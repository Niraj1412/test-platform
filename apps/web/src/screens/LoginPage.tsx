'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/auth.api'

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/dashboard'
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const [email, setEmail] = useState('admin@quizforge.local')
  const [password, setPassword] = useState('AdminPass123!')
  const [error, setError] = useState('')

  const loginToDemo = async () => {
    const cleanEmail = email.trim()
    if (!cleanEmail || !password.trim()) {
      setError('Enter an email and password to continue.')
      return
    }

    try {
      const data = await authApi.login({ email: cleanEmail, password })
      setUser(data.user)
      setAccessToken(data.accessToken)
      router.push(from)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to login.')
    }
  }

  const isRedirected = searchParams.has('from')

  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-extrabold text-primary">QuizForge</h1>
        {isRedirected ? (
          <p className="mt-2 text-muted-foreground">Sign in to continue where you left off.</p>
        ) : (
          <p className="mt-2 text-muted-foreground">Sign in to Creator Studio.</p>
        )}
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            setError('')
            loginToDemo()
          }}
        >
          <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <div className="text-right text-sm">
            <button type="button" className="font-semibold text-primary" onClick={() => setError('Password reset is mocked in this demo.')}>
              Forgot password?
            </button>
          </div>
          {error && <div className="rounded-md bg-danger-soft p-3 text-sm text-danger">{error}</div>}
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-5 text-sm text-muted-foreground">
          New creator?{' '}
          <Link href="/register" className="font-semibold text-primary">
            Register
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}
