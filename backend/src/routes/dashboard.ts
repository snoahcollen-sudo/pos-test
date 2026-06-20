import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const [todaySales, weeklySales, monthlySales, totalProducts, lowStockProducts, totalCustomers, totalSuppliers, recentSales, topProducts] = await Promise.all([
      prisma.sale.aggregate({ where: { createdAt: { gte: today }, status: "completed" }, _sum: { total: true } }),
      prisma.sale.aggregate({ where: { createdAt: { gte: weekAgo }, status: "completed" }, _sum: { total: true } }),
      prisma.sale.aggregate({ where: { createdAt: { gte: monthStart }, status: "completed" }, _sum: { total: true } }),
      prisma.product.count(),
      prisma.product.findMany({ where: { stock: { lte: prisma.product.fields.minimumStock } }, take: 5 }),
      prisma.customer.count(),
      prisma.supplier.count(),
      prisma.sale.findMany({ where: { status: "completed" }, include: { items: true, customer: true }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.saleItem.groupBy({ by: ["productId"], _sum: { quantity: true, total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
    ])

    const todayProfit = await prisma.saleItem.findMany({ where: { sale: { createdAt: { gte: today }, status: "completed" } } })
    const profit = todayProfit.reduce((sum, i) => sum + (i.price - i.costPrice) * i.quantity, 0)

    const inventoryValue = await prisma.product.aggregate({ _sum: { costPrice: true } })

    const topProductsWithNames = await Promise.all(topProducts.map(async (tp) => {
      const product = await prisma.product.findUnique({ where: { id: tp.productId } })
      return { name: product?.name || "Unknown", quantity: tp._sum.quantity || 0, revenue: tp._sum.total || 0 }
    }))

    res.json({
      success: true,
      data: {
        todaySales: todaySales._sum.total || 0,
        todayProfit: profit,
        weeklySales: weeklySales._sum.total || 0,
        monthlySales: monthlySales._sum.total || 0,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        totalCustomers,
        totalSuppliers,
        recentTransactions: recentSales,
        topProducts: topProductsWithNames,
        inventoryValue: inventoryValue._sum.costPrice || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
