import api from "./api"

export const expenseApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) => api.get("/expenses", { params }),
  create: (data: any) => api.post("/expenses", data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
}
