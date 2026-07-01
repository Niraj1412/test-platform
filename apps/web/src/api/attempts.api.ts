import type { Attempt, ResponseData } from '@quizforge/shared'
import api from './client'

export const attemptsApi = {
  async join(accessCode: string) {
    const response = await api.post<{ success: true; data: unknown }>('/attempts/join', { accessCode })
    return response.data.data
  },
  async start(testId: string, guestData?: { name: string; email: string; guestSessionId: string }) {
    const response = await api.post<{ success: true; data: Attempt & { questions?: unknown[] } }>(
      '/attempts/start',
      { testId, guestData }
    )
    return response.data.data
  },
  async saveAnswer(attemptId: string, questionId: string, responseData: ResponseData, isFlagged: boolean) {
    await api.patch(`/attempts/${attemptId}/answer`, { questionId, responseData, isFlagged })
  },
  async submit(attemptId: string) {
    const response = await api.post<{ success: true; data: Attempt }>(`/attempts/${attemptId}/submit`)
    return response.data.data
  },
  async resume(attemptId: string) {
    const response = await api.get<{ success: true; data: unknown }>(`/attempts/${attemptId}/resume`)
    return response.data.data
  },
  async get(attemptId: string) {
    const response = await api.get<{ success: true; data: any }>(`/attempts/${attemptId}`)
    return response.data.data
  }
}
