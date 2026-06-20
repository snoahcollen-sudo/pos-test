import { useState, useEffect } from "react"
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Truck,
  Loader2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber, formatDateTime } from "@/utils/cn"
import { dashboardApi } from "@/services/dashboardApi"
import { mockDashboardStats, mockProducts } from "@/mockData"

interface DashboardData {
  todaySales: number
  todayProfit: number
  weeklySales: number
  monthlySales: number
  totalProducts: number
  lowStockCount: number
  totalCustomers: number
  totalSuppliers: number
  recentTransactions: any[]
  topProducts: { name: string; quantity: number; revenue: number }[]
  inventoryValue: number
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardData>(mockDashboardStats)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingMock, setIsUsingMock] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const { data } = await dashboardApi.getStats()
      setStats(data.data)
      setIsUsingMock(false)
    } catch {
      setStats(mockDashboardStats)
      setIsUsingMock(true)
    } finally {
      setIsLoading(false)
    }
  }

  const lowStockProducts = mockProducts.filter((p) => p.stock <= p.minimumStock).slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
            {isUsingMock && <Badge variant="outline" className="ml-2">Demo Data</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Quick Sale</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</p>
                <div className="mt-1 flex items-center text-xs text-success">
                  <ArrowUpRight size={12} className="mr-1" />
                  <span>+12.5% from yesterday</span>
                </div>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayProfit)}</p>
                <div className="mt-1 flex items-center text-xs text-success">
                  <ArrowUpRight size={12} className="mr-1" />
                  <span>+8.2% from yesterday</span>
                </div>
              </div>
              <div className="rounded-xl bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalProducts)}</p>
                <div className="mt-1 flex items-center text-xs text-destructive">
                  <AlertTriangle size={12} className="mr-1" />
                  <span>{stats.lowStockCount} low stock</span>
                </div>
              </div>
              <div className="rounded-xl bg-warning/10 p-3">
                <Package className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</p>
                <div className="mt-1 flex items-center text-xs text-success">
                  <ArrowUpRight size={12} className="mr-1" />
                  <span>+24 new this week</span>
                </div>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Overview</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-xs">Week</Button>
                <Button variant="outline" size="sm" className="text-xs">Month</Button>
                <Button variant="ghost" size="sm" className="text-xs">Year</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockDashboardStats.salesChart}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--color-primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--color-primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--color-success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--color-success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--color-primary))" fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--color-success))" fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--color-primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <ShoppingCart size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{tx.customerName || tx.customer?.name || "Walk-in"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(tx.total)}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-muted-foreground">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alert</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <Package size={16} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                  <Badge variant={product.stock <= 3 ? "destructive" : "warning"}>
                    {product.stock} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3"><Truck className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Suppliers</p>
                <p className="text-xl font-bold">{stats.totalSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3"><TrendingUp className="h-6 w-6 text-success" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-xl font-bold">{formatCurrency(stats.inventoryValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3"><Clock className="h-6 w-6 text-blue-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Best Cashier</p>
                <p className="text-xl font-bold">{mockDashboardStats.bestCashier.name}</p>
                <p className="text-xs text-muted-foreground">{mockDashboardStats.bestCashier.transactions} sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
