import type { CreateSectionInput, Section, UpdateSectionInput } from '@quizforge/shared'
import api from './client'

export const sectionsApi = {
  async create(testId: string, data: CreateSectionInput) {
    const response = await api.post<{ success: true; data: Section }>(`/tests/${testId}/sections`, data)
    return response.data.data
  },
  async update(testId: string, sectionId: string, data: UpdateSectionInput) {
    const response = await api.patch<{ success: true; data: Section }>(
      `/tests/${testId}/sections/${sectionId}`,
      data
    )
    return response.data.data
  },
  async remove(testId: string, sectionId: string) {
    await api.delete(`/tests/${testId}/sections/${sectionId}`)
  },
  async reorder(testId: string, orderedIds: string[]) {
    await api.patch(`/tests/${testId}/sections/reorder`, { orderedIds })
  }
}
