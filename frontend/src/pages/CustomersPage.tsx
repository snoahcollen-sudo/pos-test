import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, Star, DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/utils/cn"
import { customerApi } from "@/services/customerApi"
import { mockCustomers } from "@/mockData"

export function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" })

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    try {
      const { data } = await customerApi.getAll({ search })
      setCustomers(data.data)
      setIsUsingMock(false)
    } catch {
      setCustomers(mockCustomers)
      setIsUsingMock(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await customerApi.create(formData)
      toast.success("Customer added!")
      setShowModal(false)
      setFormData({ name: "", phone: "", email: "", address: "" })
      fetchCustomers()
    } catch { toast.error("Failed to add customer") }
  }

  const handleDelete = async (id: string) => {
    try {
      await customerApi.delete(id)
      toast.success("Customer deleted!")
      fetchCustomers()
    } catch { toast.error("Failed to delete customer") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Customer</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Users size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{customers.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Star size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">VIP</p><p className="text-xl font-bold">{customers.filter((c) => c.points > 2000).length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><DollarSign size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Credits</p><p className="text-xl font-bold">{formatCurrency(customers.reduce((s, c) => s + (c.credit || 0), 0))}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><Star size={20} className="text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Points</p><p className="text-xl font-bold">{customers.reduce((s, c) => s + (c.points || 0), 0).toLocaleString()}</p></div></div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{c.name.split(" ").map((n: string) => n[0]).join("")}</div>
                      <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.id}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm"><Phone size={12} /> {c.phone}</div>
                      {c.email && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail size={10} /> {c.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{c.points}</Badge></TableCell>
                  <TableCell>{c.credit > 0 ? <span className="text-warning">{formatCurrency(c.credit)}</span> : "-"}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(c.totalSpent)}</TableCell>
                  <TableCell>{c.visitCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(c.id)}><Trash2 size={14} className="text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>Add Customer</DialogTitle><DialogDescription>Add a new customer to your database</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone number" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
