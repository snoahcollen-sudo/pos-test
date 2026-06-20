import api from "./api"

export const reportApi = {
  getSales: (params?: { period?: string }) => api.get("/reports/sales", { params }),
  getInventory: () => api.get("/reports/inventory"),
  getExpenses: () => api.get("/reports/expenses"),
  getTopProducts: () => api.get("/reports/products/top"),
}
