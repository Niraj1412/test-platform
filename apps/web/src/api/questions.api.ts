import type { CreateQuestionInput, Question, UpdateQuestionInput } from '@quizforge/shared'
import api from './client'

export const questionsApi = {
  async create(sectionId: string, data: CreateQuestionInput) {
    const response = await api.post<{ success: true; data: Question }>(`/sections/${sectionId}/questions`, data)
    return response.data.data
  },
  async update(questionId: string, data: UpdateQuestionInput) {
    const response = await api.patch<{ success: true; data: Question }>(`/questions/${questionId}`, data)
    return response.data.data
  },
  async remove(questionId: string) {
    await api.delete(`/questions/${questionId}`)
  },
  async reorder(sectionId: string, orderedIds: string[]) {
    await api.patch(`/sections/${sectionId}/questions/reorder`, { orderedIds })
  },
  async uploadMedia(questionId: string, file: File) {
    const data = new FormData()
    data.append('file', file)
    const response = await api.post<{ success: true; data: { url: string } }>(
      `/questions/${questionId}/media`,
      data
    )
    return response.data.data
  }
}
