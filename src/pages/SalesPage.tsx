import { useState, useEffect } from "react"
import { Search, Download, Eye, Receipt, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency, formatDateTime } from "@/utils/cn"
import { saleApi } from "@/services/saleApi"
import { mockSales } from "@/mockData"

export function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [showReceipt, setShowReceipt] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)

  useEffect(() => { fetchSales() }, [])

  const fetchSales = async () => {
    try {
      const { data } = await saleApi.getAll({ search, paymentMethod: paymentFilter === "all" ? undefined : paymentFilter })
      setSales(data.data)
      setIsUsingMock(false)
    } catch {
      setSales(mockSales)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleRefund = async (id: string) => {
    try { await saleApi.refund(id); toast.success("Sale refunded!"); fetchSales() }
    catch { toast.error("Failed to refund sale") }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  const todayTotal = sales.filter((s) => s.status === "completed").reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales History</h1>
          <p className="text-muted-foreground">View and manage all transactions {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button variant="outline"><Download size={16} className="mr-2" /> Export</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Sales</p><p className="text-2xl font-bold">{formatCurrency(todayTotal)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{sales.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{sales.filter((s) => s.status === "completed").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Refunded</p><p className="text-2xl font-bold">{sales.filter((s) => s.status === "refunded").length}</p></CardContent></Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="bank_transfer">Bank Transfer</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono font-medium">{sale.invoiceNumber}</TableCell>
                  <TableCell>{sale.customer?.name || sale.customerName || "Walk-in"}</TableCell>
                  <TableCell>{sale.cashier?.name || sale.cashierName}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{sale.paymentMethod?.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
                  <TableCell>
                    <Badge variant={sale.status === "completed" ? "success" : sale.status === "refunded" ? "destructive" : "secondary"}>{sale.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(sale.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSale(sale); setShowReceipt(true) }}><Eye size={14} /></Button>
                      {sale.status === "completed" && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRefund(sale.id)}><Receipt size={14} className="text-warning" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sales.length === 0 && <p className="py-12 text-center text-muted-foreground">No sales found</p>}
        </CardContent>
      </Card>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Receipt Preview</DialogTitle></DialogHeader>
          {selectedSale && (
            <div className="rounded-lg border bg-white p-6 text-black">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">SmartPOS</h3>
                <p className="text-xs">123 Business Street</p>
                <p className="text-xs">Tel: +1 234 567 890</p>
              </div>
              <hr className="my-2 border-dashed" />
              <p className="text-xs">Invoice: {selectedSale.invoiceNumber}</p>
              <p className="text-xs">Date: {formatDateTime(selectedSale.createdAt)}</p>
              <p className="text-xs">Cashier: {selectedSale.cashier?.name || selectedSale.cashierName}</p>
              <hr className="my-2 border-dashed" />
              {(selectedSale.items || []).map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span>{item.product?.name || item.productName} x{item.quantity}</span>
                  <span>{formatCurrency(item.total || item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="my-2 border-dashed" />
              <div className="flex justify-between text-xs"><span>Subtotal</span><span>{formatCurrency(selectedSale.subtotal)}</span></div>
              <div className="flex justify-between text-xs"><span>Tax</span><span>{formatCurrency(selectedSale.tax)}</span></div>
              <div className="flex justify-between text-xs"><span>Discount</span><span>-{formatCurrency(selectedSale.discount)}</span></div>
              <div className="flex justify-between text-sm font-bold mt-2"><span>Total</span><span>{formatCurrency(selectedSale.total)}</span></div>
              <hr className="my-2 border-dashed" />
              <p className="text-xs text-center">Thank you for shopping!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
