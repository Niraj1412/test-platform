import type { CreateQuestionInput } from '@quizforge/shared'
import api from './client'

export const questionBankApi = {
  async list(params?: { query?: string; type?: string; tag?: string }) {
    const response = await api.get<{ success: true; data: unknown[] }>('/question-bank', { params })
    return response.data.data
  },
  async create(data: CreateQuestionInput) {
    const response = await api.post<{ success: true; data: unknown }>('/question-bank', data)
    return response.data.data
  },
  async saveQuestion(questionId: string) {
    const response = await api.post<{ success: true; data: unknown }>(
      `/question-bank/from-question/${questionId}`
    )
    return response.data.data
  }
}
