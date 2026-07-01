import { useCallback, useEffect, useRef, useState } from 'react'
import type { ResponseData } from '@quizforge/shared'
import { attemptsApi } from '../api/attempts.api'

type SaveStatus = 'saved' | 'saving' | 'error'

export function useAutoSave(
  attemptId: string,
  questionId: string,
  responseData: ResponseData,
  delay = 30000
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const latestRef = useRef(responseData)
  const lastSavedRef = useRef('')

  useEffect(() => {
    latestRef.current = responseData
  }, [responseData])

  const save = useCallback(async () => {
    const serialised = JSON.stringify(latestRef.current)
    if (serialised === lastSavedRef.current) {
      return
    }
    setSaveStatus('saving')
    try {
      await attemptsApi.saveAnswer(attemptId, questionId, latestRef.current, false)
      lastSavedRef.current = serialised
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }, [attemptId, questionId])

  useEffect(() => {
    const id = window.setInterval(save, delay)
    return () => window.clearInterval(id)
  }, [delay, save])

  return { saveStatus, save }
}
