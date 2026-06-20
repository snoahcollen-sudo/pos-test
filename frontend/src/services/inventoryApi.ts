import api from "./api"

export const inventoryApi = {
  getMovements: (params?: { type?: string; productId?: string }) => api.get("/inventory", { params }),
  adjust: (data: { productId: string; quantity: number; type?: string; reference?: string; notes?: string }) => api.post("/inventory/adjust", data),
  transfer: (data: { productId: string; fromWarehouseId: string; toWarehouseId: string; quantity: number }) => api.post("/inventory/transfer", data),
}
