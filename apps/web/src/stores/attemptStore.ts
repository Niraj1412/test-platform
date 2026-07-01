import { create } from 'zustand'
import type { Attempt, ResponseData } from '@quizforge/shared'

interface AttemptState {
  attempt: Attempt | null
  answers: Record<string, ResponseData>
  flagged: Set<string>
  currentSectionIndex: number
  currentQuestionIndex: number
  startAttempt: (attempt: Attempt) => void
  saveAnswer: (questionId: string, data: ResponseData) => void
  toggleFlag: (questionId: string) => void
  navigateToQuestion: (sectionIndex: number, questionIndex: number) => void
  nextSection: () => void
}

export const useAttemptStore = create<AttemptState>((set) => ({
  attempt: null,
  answers: {},
  flagged: new Set<string>(),
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  startAttempt: (attempt) =>
    set({
      attempt,
      answers: {},
      flagged: new Set<string>(),
      currentSectionIndex: 0,
      currentQuestionIndex: 0
    }),
  saveAnswer: (questionId, data) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: data } })),
  toggleFlag: (questionId) =>
    set((state) => {
      const flagged = new Set(state.flagged)
      if (flagged.has(questionId)) {
        flagged.delete(questionId)
      } else {
        flagged.add(questionId)
      }
      return { flagged }
    }),
  navigateToQuestion: (currentSectionIndex, currentQuestionIndex) =>
    set({ currentSectionIndex, currentQuestionIndex }),
  nextSection: () =>
    set((state) => ({
      currentSectionIndex: state.currentSectionIndex + 1,
      currentQuestionIndex: 0
    }))
}))
