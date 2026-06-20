import api from "./api"

export const employeeApi = {
  getAll: (params?: { search?: string }) => api.get("/employees", { params }),
  create: (data: any) => api.post("/employees", data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  clockIn: (id: string, data?: any) => api.post(`/employees/${id}/attendance`, data),
}
