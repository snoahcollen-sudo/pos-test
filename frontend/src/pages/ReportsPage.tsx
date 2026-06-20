import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, DollarSign, Download, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/utils/cn"
import { reportApi } from "@/services/reportApi"
import { mockDashboardStats } from "@/mockData"

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"]

export function ReportsPage() {
  const [salesData, setSalesData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [expenseData, setExpenseData] = useState<any>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(false)

  useEffect(() => { fetchReportData() }, [])

  const fetchReportData = async () => {
    try {
      const [salesRes, invRes, expRes, topRes] = await Promise.all([
        reportApi.getSales({ period: "monthly" }),
        reportApi.getInventory(),
        reportApi.getExpenses(),
        reportApi.getTopProducts(),
      ])
      setSalesData(salesRes.data.data)
      setInventoryData(invRes.data.data)
      setExpenseData(expRes.data.data)
      setTopProducts(topRes.data.data)
      setIsUsingMock(false)
    } catch {
      setSalesData({ totalSales: 72450, totalProfit: 48200, totalTax: 7245, totalDiscount: 1800, transactionCount: 156 })
      setInventoryData({ totalProducts: 450, lowStock: 12, totalValue: 285000 })
      setExpenseData({ totalExpenses: 4504, byCategory: { Rent: 3500, Utilities: 450, Transport: 120, Internet: 89, Maintenance: 280 } })
      setTopProducts(mockDashboardStats.topProducts)
      setIsUsingMock(true)
    } finally { setIsLoading(false) }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  const profitData = [
    { month: "Jan", profit: 8500, expenses: 4200 },
    { month: "Feb", profit: 9200, expenses: 3800 },
    { month: "Mar", profit: 11000, expenses: 4500 },
    { month: "Apr", profit: 10500, expenses: 4100 },
    { month: "May", profit: 12800, expenses: 4800 },
    { month: "Jun", profit: salesData?.totalProfit || 13500, expenses: expenseData?.totalExpenses || 5000 },
  ]

  const categoryData = expenseData?.byCategory
    ? Object.entries(expenseData.byCategory).map(([name, amount]) => ({ name, value: amount as number }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Business analytics and insights {isUsingMock && <Badge variant="outline" className="ml-2">Demo Data</Badge>}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar size={16} className="mr-2" /> This Month</Button>
          <Button variant="outline"><Download size={16} className="mr-2" /> Export PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Sales</p><p className="text-2xl font-bold">{formatCurrency(salesData?.totalSales || 0)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Profit</p><p className="text-2xl font-bold text-success">{formatCurrency(salesData?.totalProfit || 0)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{salesData?.transactionCount || 0}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Discounts</p><p className="text-2xl font-bold text-warning">{formatCurrency(salesData?.totalDiscount || 0)}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mockDashboardStats.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f620" />
                  <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="#22c55e20" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold">{inventoryData?.totalProducts || 0}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold text-destructive">{inventoryData?.lowStock || 0}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Inventory Value</p><p className="text-2xl font-bold">{formatCurrency(inventoryData?.totalValue || 0)}</p></CardContent></Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Top Products by Revenue</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name }: any) => name}>
                      {categoryData.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold text-success">{formatCurrency(salesData?.totalSales || 0)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Expenses</p><p className="text-2xl font-bold text-destructive">{formatCurrency(expenseData?.totalExpenses || 0)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Net Profit</p><p className="text-2xl font-bold">{formatCurrency((salesData?.totalProfit || 0) - (expenseData?.totalExpenses || 0))}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Profit vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
