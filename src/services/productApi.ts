import api from "./api"

export interface ProductQuery {
  search?: string
  categoryId?: string
  status?: string
  page?: number
  limit?: number
}

export const productApi = {
  getAll: (params?: ProductQuery) => api.get("/products", { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products", data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
}
