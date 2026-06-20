import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, FolderTree, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { categoryApi } from "@/services/categoryApi"
import { mockCategories } from "@/mockData"

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", color: "#3b82f6" })

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await categoryApi.getAll()
      setCategories(data.data)
      setIsUsingMock(false)
    } catch {
      setCategories(mockCategories)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try { await categoryApi.create(formData); toast.success("Category created!"); setShowModal(false); setFormData({ name: "", description: "", color: "#3b82f6" }); fetchCategories() }
    catch { toast.error("Failed to create category") }
  }

  const handleDelete = async (id: string) => {
    try { await categoryApi.delete(id); toast.success("Category deleted!"); fetchCategories() }
    catch { toast.error("Failed to delete category") }
  }

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Category</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl p-3" style={{ backgroundColor: `${cat.color}20` }}>
                    <FolderTree size={24} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(cat.id)}><Trash2 size={14} className="text-destructive" /></Button>
                </div>
              </div>
              <div className="mt-4"><Badge variant="secondary">{cat.productCount || 0} products</Badge></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Category</DialogTitle><DialogDescription>Create a new product category</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Category name" /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" /></div>
            <div className="space-y-2"><Label>Color</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-10" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
