import api from "./api"

export interface SalePayload {
  customerId?: string
  items: { productId: string; quantity: number; price: number; costPrice: number; discount?: number; tax?: number }[]
  subtotal: number
  tax?: number
  discount?: number
  total: number
  paymentMethod: string
  amountTendered: number
  change?: number
  notes?: string
}

export const saleApi = {
  getAll: (params?: { search?: string; paymentMethod?: string; status?: string; page?: number; limit?: number }) => api.get("/sales", { params }),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data: SalePayload) => api.post("/sales", data),
  refund: (id: string) => api.post(`/sales/${id}/refund`),
}
