import { useState, useEffect } from "react"
import { Plus, Search, CreditCard, TrendingDown, DollarSign, PieChart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency, formatDate } from "@/utils/cn"
import { expenseApi } from "@/services/expenseApi"
import { mockExpenses } from "@/mockData"

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [formData, setFormData] = useState({ category: "", description: "", amount: 0, paymentMethod: "cash" })

  useEffect(() => { fetchExpenses() }, [])

  const fetchExpenses = async () => {
    try {
      const { data } = await expenseApi.getAll()
      setExpenses(data.data)
      setIsUsingMock(false)
    } catch {
      setExpenses(mockExpenses)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try { await expenseApi.create(formData); toast.success("Expense added!"); setShowModal(false); setFormData({ category: "", description: "", amount: 0, paymentMethod: "cash" }); fetchExpenses() }
    catch { toast.error("Failed to add expense") }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const expenseByCategory = Object.entries(expenses.reduce((acc: any, e: any) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {})).map(([name, amount]) => ({ name, amount }))

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage business expenses {isUsingMock && <Badge variant="outline" className="ml-2">Demo</Badge>}</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-2" /> Add Expense</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-destructive/10 p-2"><TrendingDown size={20} className="text-destructive" /></div><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><CreditCard size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Count</p><p className="text-2xl font-bold">{expenses.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><DollarSign size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Average</p><p className="text-2xl font-bold">{expenses.length > 0 ? formatCurrency(totalExpenses / expenses.length) : "$0"}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><PieChart size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Categories</p><p className="text-2xl font-bold">{expenseByCategory.length}</p></div></div></CardContent></Card>
      </div>

      {expenseByCategory.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--color-primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell className="font-semibold text-destructive">-{formatCurrency(e.amount)}</TableCell>
                  <TableCell className="capitalize">{e.paymentMethod?.replace("_", " ")}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.date || e.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle><DialogDescription>Record a new expense</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Category</Label>
              <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="">Select</option><option>Rent</option><option>Utilities</option><option>Transport</option><option>Internet</option><option>Maintenance</option><option>Supplies</option>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Expense details" /></div>
            <div className="space-y-2"><Label>Amount</Label><Input type="number" value={formData.amount || ""} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} placeholder="0.00" /></div>
            <div className="space-y-2"><Label>Payment Method</Label>
              <Select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="cash">Cash</option><option value="card">Card</option><option value="bank_transfer">Bank Transfer</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
