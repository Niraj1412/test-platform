import type { LoginInput, RegisterInput, SafeUser } from '@quizforge/shared'
import api from './client'

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: SafeUser
}

export const authApi = {
  async register(data: RegisterInput) {
    const response = await api.post<{ success: true; data: { user: SafeUser } }>('/auth/register', data)
    return response.data.data
  },
  async login(data: LoginInput) {
    const response = await api.post<{ success: true; data: LoginResult }>('/auth/login', data)
    return response.data.data
  },
  async createGuestSession(data: { accessCode: string; name: string; email: string }) {
    const response = await api.post<{ success: true; data: { guestToken: string } }>(
      '/auth/guest-session',
      data
    )
    return response.data.data
  },
  async logout() {
    await api.post('/auth/logout', {})
  }
}
