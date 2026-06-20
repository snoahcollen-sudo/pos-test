import api from "./api"

export const branchApi = {
  getAll: () => api.get("/branches"),
  create: (data: any) => api.post("/branches", data),
  update: (id: string, data: any) => api.put(`/branches/${id}`, data),
  delete: (id: string) => api.delete(`/branches/${id}`),
}
