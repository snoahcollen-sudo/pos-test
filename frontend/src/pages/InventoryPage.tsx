import { useState, useEffect } from "react"
import { Warehouse, Plus, Search, Package, AlertTriangle, Truck, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { formatCurrency } from "@/utils/cn"
import { inventoryApi } from "@/services/inventoryApi"
import { productApi } from "@/services/productApi"
import { mockProducts } from "@/mockData"

export function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [adjustData, setAdjustData] = useState({ productId: "", quantity: 0, notes: "" })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [prodRes, movRes] = await Promise.all([productApi.getAll(), inventoryApi.getMovements()])
      setProducts(prodRes.data.data)
      setMovements(movRes.data.data)
    } catch {
      setProducts(mockProducts)
      setMovements([])
    } finally { setIsLoading(false) }
  }

  const handleAdjust = async () => {
    try { await inventoryApi.adjust(adjustData); toast.success("Stock adjusted!"); setShowAdjustModal(false); fetchData() }
    catch { toast.error("Failed to adjust stock") }
  }

  const lowStock = products.filter((p) => p.stock <= p.minimumStock)
  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0)

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Inventory</h1><p className="text-muted-foreground">Manage stock levels and movements</p></div>
        <div className="flex gap-2">
          <Button variant="outline"><ArrowUpDownIcon size={16} className="mr-2" /> Transfer</Button>
          <Button onClick={() => setShowAdjustModal(true)}><RotateCcw size={16} className="mr-2" /> Adjust</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Package size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{products.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><AlertTriangle size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold">{lowStock.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Warehouse size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Value</p><p className="text-2xl font-bold">{formatCurrency(totalValue)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><Truck size={20} className="text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Movements</p><p className="text-2xl font-bold">{movements.length}</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="low">Low Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead><TableHead>Min Stock</TableHead><TableHead>Value</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>{p.minimumStock}</TableCell>
                      <TableCell>{formatCurrency(p.costPrice * p.stock)}</TableCell>
                      <TableCell><Badge variant={p.stock <= p.minimumStock ? "destructive" : "success"}>{p.stock <= p.minimumStock ? "Low" : "OK"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Current</TableHead><TableHead>Minimum</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {lowStock.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell><Badge variant="destructive">{p.stock}</Badge></TableCell>
                      <TableCell>{p.minimumStock}</TableCell>
                      <TableCell><Button size="sm" onClick={() => { setAdjustData({ ...adjustData, productId: p.id, quantity: 50 }); setShowAdjustModal(true) }}>Reorder</Button></TableCell>
                    </TableRow>
                  ))}
                  {lowStock.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">All products are well stocked</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Product</TableHead><TableHead>Quantity</TableHead><TableHead>Reference</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell><Badge variant={m.type.includes("in") ? "success" : "destructive"}>{m.type}</Badge></TableCell>
                      <TableCell>{m.product?.name}</TableCell>
                      <TableCell className={m.quantity > 0 ? "text-success" : "text-destructive"}>{m.quantity > 0 ? "+" : ""}{m.quantity}</TableCell>
                      <TableCell>{m.reference || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(m.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {movements.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No stock movements recorded</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adjust Stock</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Product</Label>
              <Select value={adjustData.productId} onChange={(e) => setAdjustData({ ...adjustData, productId: e.target.value })}>
                <option value="">Select product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2"><Label>Quantity (+ for in, - for out)</Label><Input type="number" value={adjustData.quantity || ""} onChange={(e) => setAdjustData({ ...adjustData, quantity: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Notes</Label><Input value={adjustData.notes} onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })} placeholder="Reason for adjustment" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustModal(false)}>Cancel</Button>
            <Button onClick={handleAdjust}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ArrowUpDownIcon({ size, className }: { size: number; className?: string }) {
  return <Truck size={size} className={className} />
}
