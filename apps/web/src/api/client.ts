import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api',
  withCredentials: true
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let queue: Array<(token: string | null) => void> = []

const flushQueue = (token: string | null) => {
  queue.forEach((resolve) => resolve(token))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Check if the request is for an authentication endpoint
    const isAuthRequest = originalRequest?.url && (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/logout') ||
      originalRequest.url.includes('/auth/guest-session')
    )

    // Handle 403 Forbidden (insufficient permissions / role mismatch)
    if (error.response?.status === 403) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || !originalRequest || isAuthRequest) {
      // If any authentication request itself returns a 401 (especially refresh), logout and redirect to login
      if (error.response?.status === 401 && isAuthRequest) {
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) {
            reject(error)
            return
          }
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api.request(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const response = await api.post<{ success: true; data: { accessToken: string } }>('/auth/refresh', {})
      const token = response.data.data.accessToken
      useAuthStore.getState().setAccessToken(token)
      flushQueue(token)
      originalRequest.headers.Authorization = `Bearer ${token}`
      return api.request(originalRequest)
    } catch (refreshError) {
      flushQueue(null)
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
