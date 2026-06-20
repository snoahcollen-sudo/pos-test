import axios from "axios"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("smartpos-access-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem("smartpos-refresh-token")
      if (!refreshToken) {
        localStorage.removeItem("smartpos-access-token")
        localStorage.removeItem("smartpos-refresh-token")
        localStorage.removeItem("smartpos-user")
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = data.data
        localStorage.setItem("smartpos-access-token", accessToken)
        localStorage.setItem("smartpos-refresh-token", newRefreshToken)
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("smartpos-access-token")
        localStorage.removeItem("smartpos-refresh-token")
        localStorage.removeItem("smartpos-user")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const message = error.response?.data?.message || error.message || "An error occurred"
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
