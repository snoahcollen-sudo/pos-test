import { useState, useEffect } from "react"
import { Plus, Store, MapPin, Users, Package, DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/utils/cn"
import { branchApi } from "@/services/branchApi"

export function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" })

  useEffect(() => { fetchBranches() }, [])

  const fetchBranches = async () => {
    try {
      const { data } = await branchApi.getAll()
      setBranches(data.data)
    } catch {
      setBranches([
        { id: "b1", name: "Main Branch", address: "123 Main Street", employees: 8, products: 450, sales: 72450 },
        { id: "b2", name: "Branch 2", address: "456 Oak Avenue", employees: 5, products: 320, sales: 45200 },
        { id: "b3", name: "Warehouse", address: "789 Industrial Road", employees: 3, products: 890, sales: 0 },
      ])
    } finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try { await branchApi.create(formData); toast.success("Branch created!"); setShowModal(false); fetchBranches() }
    catch { toast.error("Failed to create branch") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Branches</h1><p className="text-muted-foreground">Manage multiple store locations</p></div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Branch</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3"><Store size={24} className="text-primary" /></div>
                  <div><CardTitle>{branch.name}</CardTitle><div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={12} /> {branch.address}</div></div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-muted p-3"><Users size={16} className="mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-bold">{branch.employees || 0}</p><p className="text-xs text-muted-foreground">Employees</p></div>
                <div className="rounded-lg bg-muted p-3"><Package size={16} className="mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-bold">{branch.products || 0}</p><p className="text-xs text-muted-foreground">Products</p></div>
                <div className="rounded-lg bg-muted p-3"><DollarSign size={16} className="mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-bold">{formatCurrency(branch.sales || 0)}</p><p className="text-xs text-muted-foreground">Sales</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Branch</DialogTitle><DialogDescription>Register a new store location</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Branch Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Branch name" /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
