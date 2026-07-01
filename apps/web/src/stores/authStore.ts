import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SafeUser } from '@quizforge/shared'

interface AuthState {
  user: SafeUser | null
  accessToken: string | null
  setUser: (user: SafeUser) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null })
    }),
    {
      name: 'quizforge-auth',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
