'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SafeUser } from '@quizforge/shared'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Toast } from '../components/ui/Toast'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/auth.api'

export function RegisterPage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const [name, setName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex@quizforge.local')
  const [password, setPassword] = useState('CreatorPass123!')
  const [showVerification, setShowVerification] = useState(false)
  const [error, setError] = useState('')

  const registerDemoCreator = async () => {
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    if (!cleanName || !cleanEmail || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    try {
      await authApi.register({ name: cleanName, email: cleanEmail, password })
      setShowVerification(true)
      window.setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Registration failed.')
    }
  }

  return (
    <AuthLayout>
      {showVerification && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message="Verification email confirmed for this demo. Opening Creator Dashboard." tone="success" />
        </div>
      )}
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-3xl font-extrabold text-primary">Create Creator Account</h1>
        <p className="mt-2 text-muted-foreground">Register as a test creator and continue to email verification.</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            registerDemoCreator()
          }}
        >
          <label className="block text-sm font-bold">
            Full name
            <Input className="mt-2" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block text-sm font-bold">
            Email
            <Input className="mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block text-sm font-bold">
            Password
            <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label className="block text-sm font-bold">
            Role
            <Input className="mt-2" value="Creator" readOnly />
          </label>
          {error && <div className="rounded-md bg-danger-soft p-3 text-sm text-danger">{error}</div>}
          <Button className="w-full" type="submit">
            Register and Verify
          </Button>
        </form>
        <div className="mt-5 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Login
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}
