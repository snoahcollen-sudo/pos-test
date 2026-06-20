import api from "./api"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: string
  phone?: string
}

export const authApi = {
  login: (data: LoginPayload) => api.post("/auth/login", data),
  register: (data: RegisterPayload) => api.post("/auth/register", data),
  refresh: (refreshToken: string) => api.post("/auth/refresh", { refreshToken }),
  getMe: () => api.get("/auth/me"),
}
