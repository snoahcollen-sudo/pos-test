import api from "./api"

export const purchaseApi = {
  getAll: (params?: { status?: string; paymentStatus?: string }) => api.get("/purchases", { params }),
  getById: (id: string) => api.get(`/purchases/${id}`),
  create: (data: any) => api.post("/purchases", data),
  receive: (id: string) => api.put(`/purchases/${id}/receive`),
}
