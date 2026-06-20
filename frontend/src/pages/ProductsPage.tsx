import { useState, useEffect } from "react"
import { Plus, Search, Download, Upload, Edit, Trash2, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/utils/cn"
import { productApi } from "@/services/productApi"
import { categoryApi } from "@/services/categoryApi"
import { mockProducts, mockCategories } from "@/mockData"
import type { Product, Category } from "@/types"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await productApi.getAll({ search, categoryId: categoryFilter === "all" ? undefined : categoryFilter })
      setProducts(data.data)
      setIsUsingMock(false)
    } catch {
      setProducts(mockProducts)
      setIsUsingMock(true)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await categoryApi.getAll()
      setCategories(data.data)
    } catch {
      setCategories(mockCategories)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async () => {
    if (!selectedProduct) return
    try {
      await productApi.delete(selectedProduct.id)
      toast.success("Product deleted")
      fetchProducts()
    } catch {
      toast.error("Failed to delete product")
    }
    setShowDeleteModal(false)
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
            {isUsingMock && <Badge variant="outline" className="ml-2">Demo Data</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload size={16} className="mr-2" /> Import</Button>
          <Button variant="outline" size="sm"><Download size={16} className="mr-2" /> Export</Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}><Plus size={16} className="mr-2" /> Add Product</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.categoryId)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package size={18} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.barcode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell><Badge variant="outline">{cat?.name || "N/A"}</Badge></TableCell>
                    <TableCell className="font-medium">{formatCurrency(product.sellingPrice)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(product.costPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock <= product.minimumStock ? "destructive" : "secondary"}>{product.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "success" : "secondary"}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProduct(product); setShowEditModal(true) }}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProduct(product); setShowDeleteModal(true) }}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package size={48} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details to add a new product to inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Product Name</Label><Input placeholder="Enter product name" /></div>
              <div className="space-y-2"><Label>SKU</Label><Input placeholder="Auto-generated" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Category</Label>
                <Select><option value="">Select category</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</Select>
              </div>
              <div className="space-y-2"><Label>Barcode</Label><Input placeholder="Enter barcode" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Cost Price</Label><Input type="number" placeholder="0.00" /></div>
              <div className="space-y-2"><Label>Selling Price</Label><Input type="number" placeholder="0.00" /></div>
              <div className="space-y-2"><Label>Tax (%)</Label><Input type="number" placeholder="0" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Stock Quantity</Label><Input type="number" placeholder="0" /></div>
              <div className="space-y-2"><Label>Minimum Stock</Label><Input type="number" placeholder="0" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddModal(false); toast.success("Product added!") }}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Product Name</Label><Input defaultValue={selectedProduct.name} /></div>
                <div className="space-y-2"><Label>SKU</Label><Input defaultValue={selectedProduct.sku} readOnly /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Cost Price</Label><Input type="number" defaultValue={selectedProduct.costPrice} /></div>
                <div className="space-y-2"><Label>Selling Price</Label><Input type="number" defaultValue={selectedProduct.sellingPrice} /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" defaultValue={selectedProduct.stock} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={() => { setShowEditModal(false); toast.success("Product updated!") }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
