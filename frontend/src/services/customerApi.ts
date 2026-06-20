import api from "./api"

export const customerApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) => api.get("/customers", { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post("/customers", data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
}
