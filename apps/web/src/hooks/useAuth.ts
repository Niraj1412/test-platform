import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken)
  }
}
