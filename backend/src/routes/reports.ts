import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/sales", async (req: AuthRequest, res: Response) => {
  try {
    const { period = "daily", startDate, endDate } = req.query
    const now = new Date()
    let start = new Date()
    if (period === "daily") start.setHours(0, 0, 0, 0)
    else if (period === "weekly") start.setDate(now.getDate() - 7)
    else if (period === "monthly") start.setMonth(now.getMonth() - 1)
    else if (period === "yearly") start.setFullYear(now.getFullYear() - 1)

    const sales = await prisma.sale.findMany({ where: { createdAt: { gte: start }, status: "completed" }, include: { items: true } })
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
    const totalProfit = sales.reduce((sum, s) => sum + s.items.reduce((ps, i) => ps + (i.price - i.costPrice) * i.quantity, 0), 0)
    const totalTax = sales.reduce((sum, s) => sum + s.tax, 0)
    const totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0)
    res.json({ success: true, data: { totalSales, totalProfit, totalTax, totalDiscount, transactionCount: sales.length } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/inventory", async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true } })
    const totalProducts = products.length
    const lowStock = products.filter((p) => p.stock <= p.minimumStock).length
    const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0)
    res.json({ success: true, data: { totalProducts, lowStock, totalValue } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/expenses", async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany()
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory = expenses.reduce((acc: any, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {})
    res.json({ success: true, data: { totalExpenses, byCategory } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/products/top", async (req: AuthRequest, res: Response) => {
  try {
    const saleItems = await prisma.saleItem.groupBy({ by: ["productId"], _sum: { quantity: true, total: true }, orderBy: { _sum: { total: "desc" } }, take: 10 })
    const results = await Promise.all(saleItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      return { name: product?.name || "Unknown", quantity: item._sum.quantity || 0, revenue: item._sum.total || 0 }
    }))
    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
