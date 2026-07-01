'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { Modal } from '../components/ui/Modal'
import { attemptsApi } from '../api/attempts.api'

export function ResultsPage() {
  const { attemptId } = useParams() as { attemptId: string }
  const [attempt, setAttempt] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true)
        const data = await attemptsApi.get(attemptId)
        setAttempt(data)
      } catch (err: any) {
        console.error('Error fetching attempt results:', err)
        showToast('Failed to load assessment results.', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    if (attemptId) {
      loadResults()
    }
  }, [attemptId])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-on-surface-variant">Retrieving assessment scorecard...</p>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6 text-center text-on-surface">
        <MaterialIcon name="warning" className="text-[48px] text-error mb-4" />
        <h1 className="text-2xl font-extrabold">Results Not Found</h1>
        <p className="text-on-surface-variant mt-2 max-w-md">We couldn't retrieve the scores for this attempt.</p>
        <Link href="/" className="mt-6 text-primary hover:underline font-medium">Return to Home</Link>
      </div>
    )
  }

  // Calculate section scores
  const sectionBreakdown = attempt.test?.sections?.map((section: any) => {
    let sectionScore = 0
    let sectionTotal = 0
    section.questions?.forEach((q: any) => {
      sectionTotal += q.marks || 0
      const ans = attempt.answers?.find((a: any) => a.questionId === q.id)
      if (ans) {
        sectionScore += ans.earnedMarks || 0
      }
    })
    const pct = sectionTotal > 0 ? Math.round((sectionScore / sectionTotal) * 100) : 0
    return {
      name: section.title,
      score: sectionScore,
      outOf: sectionTotal,
      percent: `${pct}%`
    }
  }) || []

  // Map answers for the review sheet modal
  const reviewAnswers = attempt.test?.sections?.flatMap((s: any) => s.questions || []).map((q: any) => {
    const ans = attempt.answers?.find((a: any) => a.questionId === q.id)
    
    let selectedText = 'No response'
    if (ans?.responseData) {
      const resp = ans.responseData
      if (resp.type === 'MCQ_SINGLE') {
        const opt = q.questionData?.options?.find((o: any) => o.id === resp.selectedOptionId)
        selectedText = opt ? opt.text : 'Unknown Option'
      } else if (resp.type === 'TRUE_FALSE') {
        selectedText = resp.answer ? 'True' : 'False'
      } else if (resp.type === 'FILL_BLANK') {
        selectedText = resp.blankAnswers?.blank1 || 'Empty'
      }
    }

    const isCorrect = ans?.isCorrect
    const resultText = isCorrect === true ? 'Correct' : isCorrect === false ? 'Incorrect' : 'Pending Review'

    return {
      question: q.body,
      selected: selectedText,
      result: resultText,
      isCorrect
    }
  }) || []

  // Format completed date
  const completedDate = attempt.submittedAt 
    ? new Date(attempt.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A'

  // Calculate elapsed time formatted
  const elapsedMs = attempt.submittedAt && attempt.startedAt
    ? new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()
    : 0
  const elapsedMins = Math.floor(elapsedMs / 60000)
  const elapsedSecs = Math.floor((elapsedMs % 60000) / 1000)
  const timeTakenStr = elapsedMs > 0 ? `${elapsedMins}m ${elapsedSecs}s` : 'Flexible'

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background antialiased">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
          <Link href="/" className="flex items-center gap-2">
            <MaterialIcon name="quiz" className="text-primary" />
            <span className="text-2xl font-bold text-primary">QuizForge</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary">
            <MaterialIcon name="logout" />
            Exit
          </Link>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center p-margin-mobile md:p-margin-desktop bg-[#fbfaff]">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="border-b border-outline-variant bg-surface-container-low/50 p-gutter text-center">
            {attempt.passed !== null && (
              <div className={`mb-6 inline-flex items-center justify-center rounded-full px-4 py-1 ${attempt.passed ? 'bg-success-container/20 text-success' : 'bg-error-container/20 text-error'}`}>
                <MaterialIcon name={attempt.passed ? 'check_circle' : 'cancel'} className="mr-2 text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider">{attempt.passed ? 'Passed' : 'Failed'}</span>
              </div>
            )}
            <h1 className="mb-2 text-4xl font-bold text-on-surface">{attempt.rawScore} / {attempt.totalMarks}</h1>
            <p className="mb-6 text-lg text-on-surface-variant">
              Score: {attempt.percentage}% <span className="mx-2 text-outline">•</span> Passing: {attempt.test?.passingScore}%
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-on-surface-variant">
              <div className="flex items-center gap-2">
                <MaterialIcon name="timer" className="text-outline" />
                <span className="text-sm">Time Taken: {timeTakenStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="calendar_today" className="text-outline" />
                <span className="text-sm">Completed: {completedDate}</span>
              </div>
            </div>
          </div>

          <div className="p-gutter">
            <h2 className="mb-4 text-xl font-semibold text-on-surface">Section Breakdown</h2>
            <div className="overflow-hidden rounded-lg border border-outline-variant">
              <table className="w-full border-collapse text-left bg-surface">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Section</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Score</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Out Of</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {sectionBreakdown.map((section: any, idx: number) => (
                    <tr key={section.name || idx} className="transition-colors hover:bg-surface-container-low/50">
                      <td className="px-4 py-3 text-sm text-on-surface">{section.name}</td>
                      <td className="px-4 py-3 text-right text-sm text-on-surface">{section.score}</td>
                      <td className="px-4 py-3 text-right text-sm text-on-surface-variant">{section.outOf}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-on-surface">{section.percent}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-outline-variant bg-surface-container-low">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-on-surface">Total</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-on-surface">{attempt.rawScore}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-on-surface">{attempt.totalMarks}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-on-surface">{attempt.percentage}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4 border-t border-outline-variant bg-surface-container-low p-gutter sm:flex-row">
            {attempt.test?.accessCode && (
              <Link href={`/t/${attempt.test.accessCode}`} className="flex h-12 items-center justify-center gap-2 rounded-lg border border-outline-variant px-6 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-highest bg-surface">
                <MaterialIcon name="refresh" className="text-sm" />
                Retake Test
              </Link>
            )}
            <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-fixed" onClick={() => setIsSheetOpen(true)}>
              <MaterialIcon name="visibility" className="text-sm" />
              View Answer Sheet
            </button>
          </div>
        </div>
      </main>

      <Modal title="Answer Sheet Review" open={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {reviewAnswers.map((answer: any, idx: number) => (
            <div key={idx} className="rounded border border-outline-variant bg-surface-container-lowest p-4 space-y-2">
              <div className="font-semibold text-on-surface">{answer.question}</div>
              <div className="text-sm text-on-surface-variant">Your Selected Response: <span className="font-medium text-on-surface">{answer.selected}</span></div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold uppercase rounded-full px-2 py-0.5 ${answer.isCorrect === true ? 'bg-success/10 text-success' : answer.isCorrect === false ? 'bg-error/10 text-error' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                  {answer.result}
                </span>
              </div>
            </div>
          ))}
          {reviewAnswers.length === 0 && (
            <div className="text-center py-6 text-sm text-on-surface-variant">No answers submitted.</div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-outline-variant mt-4">
          <Button onClick={() => setIsSheetOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  )
}
