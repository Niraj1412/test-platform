'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { attemptsApi } from '../api/attempts.api'
import { useCountdown } from '../hooks/useCountdown'

export function ExamPage() {
  const router = useRouter()
  const { attemptId } = useParams() as { attemptId: string }

  const [attempt, setAttempt] = useState<any | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)

  // Local answers and flagged state
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }

  const loadAttempt = async () => {
    try {
      setIsLoading(true)
      const data = (await attemptsApi.resume(attemptId)) as any
      setAttempt(data)

      // Get questions list
      let qs = data.questions || []
      if (qs.length === 0 && data.test?.sections) {
        const allQs = data.test.sections.flatMap((s: any) => s.questions || [])
        const assignedIds = data.assignedQuestions || []
        qs = assignedIds.map((id: string) => allQs.find((q: any) => q.id === id)).filter(Boolean)
      }
      setQuestions(qs)

      // Map existing answers and flagged status
      const initialAnswers: Record<string, any> = {}
      const initialFlagged = new Set<string>()

      if (data.answers) {
        data.answers.forEach((ans: any) => {
          if (ans.responseData) {
            initialAnswers[ans.questionId] = ans.responseData
          }
          if (ans.isFlagged) {
            initialFlagged.add(ans.questionId)
          }
        })
      }
      setAnswers(initialAnswers)
      setFlagged(initialFlagged)

    } catch (err: any) {
      console.error('Error resuming attempt:', err)
      showToast('Failed to resume exam attempt.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (attemptId) {
      loadAttempt()
    }
  }, [attemptId])

  const chooseAnswer = async (question: any, value: any) => {
    let responseData: any = null
    if (question.type === 'MCQ_SINGLE') {
      responseData = { type: 'MCQ_SINGLE', selectedOptionId: value }
    } else if (question.type === 'TRUE_FALSE') {
      responseData = { type: 'TRUE_FALSE', answer: value === 'true' || value === true }
    } else if (question.type === 'FILL_BLANK') {
      responseData = { type: 'FILL_BLANK', blankAnswers: { blank1: value } }
    }

    setAnswers((prev) => ({ ...prev, [question.id]: responseData }))

    try {
      await attemptsApi.saveAnswer(
        attemptId,
        question.id,
        responseData,
        flagged.has(question.id)
      )
      showToast('Answer auto-saved.')
    } catch (err) {
      showToast('Offline mode: Failed to sync answer with server.', 'error')
    }
  }

  const toggleFlag = async (questionId: string) => {
    const isFlagged = !flagged.has(questionId)
    setFlagged((prev) => {
      const next = new Set(prev)
      if (isFlagged) next.add(questionId)
      else next.delete(questionId)
      return next
    })

    const responseData = answers[questionId] || null
    try {
      await attemptsApi.saveAnswer(attemptId, questionId, responseData, isFlagged)
    } catch (err) {
      console.error(err)
    }
  }

  const submitAttempt = async () => {
    setIsSubmitOpen(false)
    setIsProcessing(true)
    try {
      await attemptsApi.submit(attemptId)
      showToast('Exam submitted successfully!')
      router.push(`/attempt/${attemptId}/result`)
    } catch (err) {
      showToast('Failed to submit exam. Please try again.', 'error')
      setIsProcessing(false)
    }
  }

  const handleAutoSubmit = async () => {
    showToast('Time is up! Submitting your exam...', 'error')
    setIsProcessing(true)
    try {
      await attemptsApi.submit(attemptId)
      router.push(`/attempt/${attemptId}/result`)
    } catch (err) {
      router.push(`/attempt/${attemptId}/result`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-on-surface-variant">Loading exam workspace...</p>
        </div>
      </div>
    )
  }

  const activeQuestion = questions[currentIdx]
  const totalQuestions = questions.length

  const answeredCount = Object.keys(answers).filter((qId) => {
    const ans = answers[qId]
    if (!ans) return false
    if (ans.type === 'MCQ_SINGLE') return !!ans.selectedOptionId
    if (ans.type === 'TRUE_FALSE') return ans.answer !== undefined && ans.answer !== null
    if (ans.type === 'FILL_BLANK') return !!ans.blankAnswers?.blank1
    return false
  }).length

  // Calculate remaining seconds
  const globalDurationMins = attempt?.test?.globalDurationMins || 60
  const elapsedSeconds = Math.floor((Date.now() - new Date(attempt?.startedAt || Date.now()).getTime()) / 1000)
  const initialSeconds = Math.max(0, globalDurationMins * 60 - elapsedSeconds)

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background text-on-background antialiased">
      {toast && (
        <div className="fixed right-6 top-20 z-50">
          <Toast message={toast.message} tone={toast.tone} />
        </div>
      )}
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface shadow-sm">
        <div className="flex h-[64px] w-full items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">{attempt?.test?.title || 'Exam in Progress'}</h1>
            {activeQuestion && (
              <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant">
                Active Attempt
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            {attempt && (
              <ExamTimer
                initialSeconds={initialSeconds}
                onExpire={handleAutoSubmit}
              />
            )}
            <button
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-base font-medium text-on-primary shadow-sm transition-colors hover:bg-primary/90"
              onClick={() => setIsSubmitOpen(true)}
            >
              Submit Exam
              <MaterialIcon name="send" className="text-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col items-center overflow-y-auto bg-surface-bright px-4 py-8 md:px-8">
          {activeQuestion ? (
            <div className="flex h-full w-full max-w-[800px] flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-on-surface">Question {currentIdx + 1} of {totalQuestions}</span>
                  <span className="rounded-full bg-surface-variant px-3 py-1 text-xs uppercase tracking-wide text-on-surface-variant">
                    {activeQuestion.type === 'MCQ_SINGLE' ? 'Multiple Choice' : activeQuestion.type === 'TRUE_FALSE' ? 'True / False' : 'Fill in Blank'}
                  </span>
                  <span className="text-sm font-semibold text-primary">{activeQuestion.marks} Marks</span>
                </div>
                <button
                  className={`group flex items-center gap-2 rounded-md border px-3 py-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-amber-600 ${flagged.has(activeQuestion.id) ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-outline-variant'}`}
                  onClick={() => toggleFlag(activeQuestion.id)}
                >
                  <MaterialIcon name="flag" fill={flagged.has(activeQuestion.id)} className="text-[20px] group-hover:text-amber-500" />
                  <span className="text-sm font-medium">Flag for Review</span>
                </button>
              </div>

              <div className="mb-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <p className="text-base leading-relaxed text-on-surface whitespace-pre-line">
                  {activeQuestion.body}
                </p>
              </div>

              <div className="mb-auto flex flex-col gap-3">
                {activeQuestion.type === 'MCQ_SINGLE' && (
                  (activeQuestion.questionData?.options || []).map((option: any) => {
                    const checked = answers[activeQuestion.id]?.selectedOptionId === option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:bg-surface-container-low ${checked ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
                      >
                        <input
                          className="sr-only"
                          checked={checked}
                          name={`question_${activeQuestion.id}`}
                          type="radio"
                          onChange={() => chooseAnswer(activeQuestion, option.id)}
                        />
                        <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-primary bg-surface' : 'border-outline'}`}>
                          {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </span>
                        <span className="pt-0.5 text-base text-on-surface">{option.text}</span>
                      </label>
                    )
                  })
                )}

                {activeQuestion.type === 'TRUE_FALSE' && (
                  [true, false].map((val) => {
                    const checked = answers[activeQuestion.id]?.answer === val
                    return (
                      <label
                        key={val.toString()}
                        className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:bg-surface-container-low ${checked ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
                      >
                        <input
                          className="sr-only"
                          checked={checked}
                          name={`question_${activeQuestion.id}`}
                          type="radio"
                          onChange={() => chooseAnswer(activeQuestion, val)}
                        />
                        <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-primary bg-surface' : 'border-outline'}`}>
                          {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </span>
                        <span className="pt-0.5 text-base text-on-surface">{val ? 'True' : 'False'}</span>
                      </label>
                    )
                  })
                )}

                {activeQuestion.type === 'FILL_BLANK' && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-on-surface-variant">Template: {activeQuestion.questionData?.template}</p>
                    <input
                      className="w-full rounded border border-outline-variant bg-surface p-4 text-base text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Type your answer here..."
                      value={answers[activeQuestion.id]?.blankAnswers?.blank1 || ''}
                      onChange={(e) => chooseAnswer(activeQuestion, e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-6">
                <button
                  className="flex h-10 items-center gap-2 rounded-md border border-outline-variant px-4 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((c) => Math.max(0, c - 1))}
                >
                  <MaterialIcon name="arrow_back" className="text-[18px]" />
                  Previous
                </button>
                <button
                  className="flex h-10 items-center gap-2 rounded-md bg-secondary px-6 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-secondary/90 disabled:opacity-50"
                  disabled={currentIdx === totalQuestions - 1}
                  onClick={() => setCurrentIdx((c) => Math.min(totalQuestions - 1, c + 1))}
                >
                  Next
                  <MaterialIcon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-on-surface-variant">
              No questions found for this exam attempt.
            </div>
          )}
        </section>

        <aside className="relative hidden h-full w-[320px] flex-shrink-0 flex-col border-l border-outline-variant bg-surface-container-low md:flex">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest p-4">
            <div className="flex items-center gap-2">
              <MaterialIcon name="grid_view" className="text-[20px] text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Navigator</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-outline-variant bg-surface" />Unanswered</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-primary bg-primary" />Answered</span>
              <span className="flex items-center gap-1.5"><span className="flex h-3 w-3 items-center justify-center rounded-sm border border-amber-500 bg-amber-500"><MaterialIcon name="flag" className="text-[8px] text-white" fill /></span>Flagged</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isFlagged = flagged.has(question.id)
                const ans = answers[question.id]
                let isAns = false
                if (ans) {
                  if (ans.type === 'MCQ_SINGLE') isAns = !!ans.selectedOptionId
                  else if (ans.type === 'TRUE_FALSE') isAns = ans.answer !== undefined && ans.answer !== null
                  else if (ans.type === 'FILL_BLANK') isAns = !!ans.blankAnswers?.blank1
                }
                const isCurrent = index === currentIdx
                return (
                  <button
                    key={question.id}
                    className={`relative flex aspect-square items-center justify-center rounded-md text-sm font-medium transition-all ${
                      isFlagged
                        ? 'bg-amber-500 text-white shadow-sm hover:opacity-90'
                        : isAns
                          ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                          : 'border border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'
                    } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    onClick={() => setCurrentIdx(index)}
                  >
                    {isFlagged && <MaterialIcon name="flag" className="absolute right-0.5 top-0.5 text-[10px]" fill />}
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mt-auto border-t border-outline-variant bg-surface-container-lowest p-4 text-center">
            <span className="text-xs text-on-surface-variant">{answeredCount} of {totalQuestions} Answered</span>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-dim">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(answeredCount / (totalQuestions || 1)) * 100}%` }} />
            </div>
          </div>
        </aside>
      </main>

      <Modal title={isProcessing ? 'Submitting your responses...' : 'Submit Exam'} open={isSubmitOpen || isProcessing} onClose={() => setIsSubmitOpen(false)}>
        {isProcessing ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-5 text-on-surface-variant">Submitting your responses...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-lg text-on-surface">You have answered {answeredCount} of {totalQuestions} questions. Are you sure you want to submit?</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
              <Button onClick={submitAttempt}>Submit</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function ExamTimer({ initialSeconds, onExpire }: { initialSeconds: number; onExpire: () => void }) {
  const timer = useCountdown(initialSeconds, onExpire)
  return (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-sm transition-colors ${timer.isWarning ? 'border-error/30 bg-error/5 text-error animate-pulse' : 'border-primary/20 bg-primary-container/10 text-primary'}`}>
      <MaterialIcon name="timer" className="text-[18px]" />
      <span className="timer-font text-lg font-semibold tracking-wider">{timer.formattedTime}</span>
    </div>
  )
}
