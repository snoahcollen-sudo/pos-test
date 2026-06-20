import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Truck, Phone, Mail, DollarSign, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/utils/cn"
import { supplierApi } from "@/services/supplierApi"
import { mockSuppliers } from "@/mockData"

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" })

  useEffect(() => { fetchSuppliers() }, [])

  const fetchSuppliers = async () => {
    try {
      const { data } = await supplierApi.getAll({ search })
      setSuppliers(data.data)
      setIsUsingMock(false)
    } catch {
      setSuppliers(mockSuppliers)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try { await supplierApi.create(formData); toast.success("Supplier added!"); setShowModal(false); setFormData({ name: "", phone: "", email: "", address: "" }); fetchSuppliers() }
    catch { toast.error("Failed to add supplier") }
  }

  const handleDelete = async (id: string) => {
    try { await supplierApi.delete(id); toast.success("Supplier deleted!"); fetchSuppliers() }
    catch { toast.error("Failed to delete supplier") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Supplier</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Truck size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{suppliers.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Package size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Products</p><p className="text-xl font-bold">{suppliers.reduce((s, sup) => s + (sup.productsSupplied || 0), 0)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-destructive/10 p-2"><DollarSign size={20} className="text-destructive" /></div><div><p className="text-sm text-muted-foreground">Outstanding</p><p className="text-xl font-bold">{formatCurrency(suppliers.reduce((s, sup) => s + (sup.outstandingBalance || 0), 0))}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><Truck size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Pending Orders</p><p className="text-xl font-bold">1</p></div></div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Truck size={18} className="text-primary" /></div>
                      <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.address}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm"><Phone size={12} /> {s.phone}</div>
                      {s.email && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail size={10} /> {s.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{s.productsSupplied || 0}</Badge></TableCell>
                  <TableCell>{s.outstandingBalance > 0 ? <span className="text-destructive font-medium">{formatCurrency(s.outstandingBalance)}</span> : <span className="text-success">Paid</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(s.id)}><Trash2 size={14} className="text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle><DialogDescription>Register a new supplier</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Supplier name" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone number" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Add Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
