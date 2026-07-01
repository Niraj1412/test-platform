'use client'

import { CalendarClock, CheckCircle, ClipboardList, LogIn, Timer, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Toast } from '../components/ui/Toast'
import { attemptsApi } from '../api/attempts.api'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../stores/authStore'

export function TestGatePage() {
  const { accessCode } = useParams() as { accessCode: string }
  const router = useRouter()
  const { setAccessToken } = useAuthStore()

  const [test, setTest] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const loadGate = async () => {
      try {
        setIsLoading(true)
        const data = await attemptsApi.join(accessCode)
        setTest(data)
      } catch (err: any) {
        console.error('Error joining test:', err)
        showToast('Failed to load test gate. Code may be invalid or test not published.', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    if (accessCode) {
      loadGate()
    }
  }, [accessCode])

  const handleStartTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || !trimmedEmail) {
      showToast('Please enter both name and email.', 'error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address (e.g. you@example.com)', 'error')
      return
    }

    try {
      const guestSession = await authApi.createGuestSession({
        accessCode,
        name: trimmedName,
        email: trimmedEmail
      })

      setAccessToken(guestSession.guestToken)

      const attempt = await attemptsApi.start(test.id)

      showToast('Session verified! Starting exam...')
      router.push(`/attempt/${attempt.id}`)
    } catch (err: any) {
      const errData = err.response?.data?.error
      if (errData?.fields) {
        const fieldMsg = Object.values(errData.fields as Record<string, string[]>).flat().join(' ')
        showToast(fieldMsg || errData.message || 'Failed to start the test.', 'error')
      } else {
        showToast(errData?.message || 'Failed to start the test.', 'error')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-on-surface-variant">Verifying access code...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6 text-center text-on-surface">
        <MaterialIcon name="warning" className="text-[48px] text-error mb-4" />
        <h1 className="text-2xl font-extrabold">Invalid Access Code</h1>
        <p className="text-on-surface-variant mt-2 max-w-md">We couldn't find a published test associated with access code "{accessCode}". Please double-check the URL or contact your exam creator.</p>
        <Link href="/" className="mt-6 text-primary hover:underline font-medium">Return to Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbfaff]">
      {toast && (
        <div className="fixed right-6 top-6 z-40">
          <Toast message={toast.message} tone={toast.tone} />
        </div>
      )}
      <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-8 shadow-sm">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          QuizForge
        </Link>
        <Button href="/login" variant="secondary" icon={<LogIn size={18} />}>
          Login
        </Button>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-8 border border-outline-variant bg-surface">
          <Badge tone="blue">Access code: {accessCode}</Badge>
          <h1 className="mt-5 text-4xl font-extrabold text-on-surface">{test.title}</h1>
          {test.description && (
            <p className="mt-4 text-lg leading-8 text-on-surface-variant">
              {test.description}
            </p>
          )}
          
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4">
              <Timer className="text-primary" />
              <div className="mt-3 font-bold text-on-surface">
                {test.globalDurationMins ? `${test.globalDurationMins} minutes` : 'No limit'}
              </div>
              <div className="text-sm text-on-surface-variant">Global timer</div>
            </div>
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4">
              <ClipboardList className="text-primary" />
              <div className="mt-3 font-bold text-on-surface">
                {test.passingScore ? `Passing score: ${test.passingScore}%` : 'Practice Mode'}
              </div>
              <div className="text-sm text-on-surface-variant">Passing standard</div>
            </div>
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4">
              <CalendarClock className="text-primary" />
              <div className="mt-3 font-bold text-on-surface">Open now</div>
              <div className="text-sm text-on-surface-variant">Test window is active</div>
            </div>
          </div>

          {test.instructions && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-on-surface">Instructions</h2>
              <p className="mt-2 text-on-surface-variant leading-relaxed whitespace-pre-line">{test.instructions}</p>
            </div>
          )}

          <h2 className="mt-10 text-2xl font-extrabold text-on-surface">Section Overview</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-outline-variant bg-surface">
            {test.sections?.map((section: any, idx: number) => (
              <div key={section.id || idx} className="grid grid-cols-[1fr_120px_100px] border-b border-outline-variant px-5 py-4 last:border-b-0 hover:bg-surface-container-low/50">
                <span className="font-semibold text-on-surface">{section.title}</span>
                <span className="text-on-surface-variant text-sm">{section.questionsToDisplay} questions</span>
                <span className="text-on-surface-variant text-sm">{section.durationMins ? `${section.durationMins} mins` : 'Flexible'}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-md border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 font-bold text-success">
              <CheckCircle size={19} />
              Gate Open & Ready
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">
              The test environment is configured and ready. You will have full navigation controls based on the test instructions.
            </p>
          </div>
        </Card>

        <Card className="p-8 border border-outline-variant bg-surface h-fit">
          <div className="flex items-center gap-3 text-2xl font-extrabold text-on-surface">
            <UserRound className="text-primary" />
            Start Exam
          </div>
          <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
            Please provide your name and email to begin this assessment attempt. This information will identify your score sheet.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleStartTest}>
            <label className="block text-sm font-bold text-on-surface">
              Full Name
              <Input
                className="mt-2 text-on-surface"
                placeholder="John Doe"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="block text-sm font-bold text-on-surface">
              Email Address
              <Input
                className="mt-2 text-on-surface"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <Button
              type="submit"
              className="w-full mt-4"
            >
              Start Attempt
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}

// MaterialIcon wrapper component since we need it in the fallback
function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded ${className}`}>
      {name}
    </span>
  )
}
