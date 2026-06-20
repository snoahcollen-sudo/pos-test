import { useState, useEffect } from "react"
import { Plus, Search, Package, Truck, Clock, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/utils/cn"
import { purchaseApi } from "@/services/purchaseApi"
import { mockPurchaseOrders } from "@/mockData"

export function PurchasesPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await purchaseApi.getAll()
      setOrders(data.data)
      setIsUsingMock(false)
    } catch {
      setOrders(mockPurchaseOrders)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleReceive = async (id: string) => {
    try { await purchaseApi.receive(id); toast.success("Order received! Stock updated."); fetchOrders() }
    catch { toast.error("Failed to receive order") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Purchase Orders</h1><p className="text-muted-foreground">Manage supplier orders {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p></div>
        <Button><Plus size={16} className="mr-2" /> New Order</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Package size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{orders.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><Clock size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-xl font-bold">{orders.filter((o) => o.status === "pending").length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><CheckCircle size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Received</p><p className="text-xl font-bold">{orders.filter((o) => o.status === "received").length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-destructive/10 p-2"><Truck size={20} className="text-destructive" /></div><div><p className="text-sm text-muted-foreground">Total Value</p><p className="text-xl font-bold">{formatCurrency(orders.reduce((s, o) => s + o.total, 0))}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-mono font-medium">{po.orderNumber}</TableCell>
                  <TableCell>{po.supplier?.name || po.supplierName}</TableCell>
                  <TableCell>{po.items?.length || 0} items</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(po.total)}</TableCell>
                  <TableCell><Badge variant={po.status === "pending" ? "warning" : po.status === "received" ? "success" : "destructive"}>{po.status}</Badge></TableCell>
                  <TableCell><Badge variant={po.paymentStatus === "paid" ? "success" : po.paymentStatus === "partial" ? "warning" : "destructive"}>{po.paymentStatus}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{po.expectedDelivery ? formatDate(po.expectedDelivery) : "N/A"}</TableCell>
                  <TableCell>
                    {po.status === "pending" && <Button size="sm" onClick={() => handleReceive(po.id)}>Receive</Button>}
                    {po.status === "received" && <Badge variant="success">Done</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && <p className="py-12 text-center text-muted-foreground">No purchase orders</p>}
        </CardContent>
      </Card>
    </div>
  )
}
