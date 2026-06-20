import { create } from "zustand"
import type { User } from "@/types"
import { authApi } from "@/services/authApi"

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { data } = await authApi.login({ email, password })
      const { user, accessToken, refreshToken } = data.data
      localStorage.setItem("smartpos-access-token", accessToken)
      localStorage.setItem("smartpos-refresh-token", refreshToken)
      localStorage.setItem("smartpos-user", JSON.stringify(user))
      set({ user, isAuthenticated: true, isLoading: false })
      return true
    } catch (error) {
      set({ isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem("smartpos-access-token")
    localStorage.removeItem("smartpos-refresh-token")
    localStorage.removeItem("smartpos-user")
    set({ user: null, isAuthenticated: false })
  },

  loadUser: async () => {
    const token = localStorage.getItem("smartpos-access-token")
    if (!token) {
      set({ user: null, isAuthenticated: false })
      return
    }
    try {
      const { data } = await authApi.getMe()
      set({ user: data.data, isAuthenticated: true })
    } catch {
      localStorage.removeItem("smartpos-access-token")
      localStorage.removeItem("smartpos-refresh-token")
      localStorage.removeItem("smartpos-user")
      set({ user: null, isAuthenticated: false })
    }
  },
}))

const savedUser = localStorage.getItem("smartpos-user")
if (savedUser) {
  try {
    useAuthStore.setState({ user: JSON.parse(savedUser), isAuthenticated: true })
  } catch {
    localStorage.removeItem("smartpos-user")
  }
}
