import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, UserCog, Mail, Phone, Shield, DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/utils/cn"
import { employeeApi } from "@/services/employeeApi"
import { mockEmployees } from "@/mockData"

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500", manager: "bg-blue-500/10 text-blue-500",
  cashier: "bg-green-500/10 text-green-500", stock_controller: "bg-yellow-500/10 text-yellow-500",
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "cashier", salary: 0, commission: 0 })

  useEffect(() => { fetchEmployees() }, [])

  const fetchEmployees = async () => {
    try {
      const { data } = await employeeApi.getAll({ search })
      setEmployees(data.data)
      setIsUsingMock(false)
    } catch {
      setEmployees(mockEmployees)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try { await employeeApi.create(formData); toast.success("Employee added!"); setShowModal(false); fetchEmployees() }
    catch { toast.error("Failed to add employee") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your staff {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Employee</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><UserCog size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{employees.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Shield size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Active</p><p className="text-xl font-bold">{employees.filter((e) => e.status === "active").length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><DollarSign size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Payroll</p><p className="text-xl font-bold">{formatCurrency(employees.reduce((s, e) => s + (e.salary || 0), 0))}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><UserCog size={20} className="text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Roles</p><p className="text-xl font-bold">{new Set(employees.map((e) => e.role)).size}</p></div></div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{emp.name.split(" ").map((n: string) => n[0]).join("")}</div>
                      <div><p className="font-medium">{emp.name}</p><p className="text-xs text-muted-foreground">Since {emp.hireDate?.split("T")[0] || emp.hireDate}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={roleColors[emp.role]} variant="secondary">{emp.role?.replace("_", " ")}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm"><Phone size={12} /> {emp.phone}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail size={10} /> {emp.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(emp.salary)}</TableCell>
                  <TableCell>{emp.commission}%</TableCell>
                  <TableCell><Badge variant={emp.status === "active" ? "success" : "secondary"}>{emp.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 size={14} className="text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Employee</DialogTitle><DialogDescription>Register a new employee</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" /></div>
            <div className="space-y-2"><Label>Role</Label>
              <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="admin">Admin</option><option value="manager">Manager</option><option value="cashier">Cashier</option><option value="stock_controller">Stock Controller</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Salary</Label><Input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Commission %</Label><Input type="number" value={formData.commission} onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
