import type { CreateTestInput, FullTest, UpdateTestInput } from '@quizforge/shared'
import api from './client'

export const testsApi = {
  async list(page = 1, limit = 20) {
    const response = await api.get<{ success: true; data: FullTest[]; meta: { total: number } }>(
      '/tests',
      { params: { page, limit } }
    )
    return response.data
  },
  async create(data: CreateTestInput) {
    const response = await api.post<{ success: true; data: FullTest }>('/tests', data)
    return response.data.data
  },
  async get(id: string) {
    const response = await api.get<{ success: true; data: FullTest }>(`/tests/${id}`)
    return response.data.data
  },
  async update(id: string, data: UpdateTestInput) {
    const response = await api.patch<{ success: true; data: FullTest }>(`/tests/${id}`, data)
    return response.data.data
  },
  async publish(id: string) {
    const response = await api.post<{ success: true; data: { accessCode: string; accessLink: string } }>(
      `/tests/${id}/publish`
    )
    return response.data.data
  },
  async duplicate(id: string) {
    const response = await api.post<{ success: true; data: FullTest }>(`/tests/${id}/duplicate`)
    return response.data.data
  }
}
