import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"
import { z } from "zod"
import { validate } from "../middleware/validate"

const router = Router()
router.use(authenticate)

const saleItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  costPrice: z.number().min(0),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
})

const saleSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(saleItemSchema).min(1),
  subtotal: z.number().min(0),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  total: z.number().min(0),
  paymentMethod: z.enum(["cash", "card", "bank_transfer", "mobile_money", "gift_card", "store_credit"]),
  amountTendered: z.number().min(0),
  change: z.number().min(0).optional(),
  notes: z.string().optional(),
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, paymentMethod, status, page = "1", limit = "20" } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    if (search) where.OR = [{ invoiceNumber: { contains: String(search), mode: "insensitive" } }, { customer: { name: { contains: String(search), mode: "insensitive" } } }]
    if (paymentMethod) where.paymentMethod = paymentMethod
    if (status) where.status = status

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({ where, include: { items: true, customer: true, cashier: true }, skip, take: Number(limit), orderBy: { createdAt: "desc" } }),
      prisma.sale.count({ where }),
    ])
    res.json({ success: true, data: sales, pagination: { total, page: Number(page), limit: Number(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const sale = await prisma.sale.findUnique({ where: { id: req.params.id }, include: { items: { include: { product: true } }, customer: true, cashier: true } })
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" })
    res.json({ success: true, data: sale })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", validate(saleSchema), async (req: AuthRequest, res: Response) => {
  try {
    const saleCount = await prisma.sale.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(saleCount + 1).padStart(3, "0")}`

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerId: req.body.customerId || null,
          cashierId: req.user!.id,
          subtotal: req.body.subtotal,
          tax: req.body.tax || 0,
          discount: req.body.discount || 0,
          total: req.body.total,
          paymentMethod: req.body.paymentMethod,
          amountTendered: req.body.amountTendered,
          change: req.body.change || 0,
          notes: req.body.notes,
          items: {
            create: req.body.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              costPrice: item.costPrice,
              discount: item.discount || 0,
              tax: item.tax || 0,
              total: (item.price - (item.discount || 0)) * item.quantity,
            })),
          },
        },
        include: { items: true },
      })

      for (const item of req.body.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      if (req.body.customerId) {
        await tx.customer.update({
          where: { id: req.body.customerId },
          data: {
            visitCount: { increment: 1 },
            totalSpent: { increment: req.body.total },
            points: { increment: Math.floor(req.body.total / 10) },
          },
        })
      }

      return newSale
    })

    res.status(201).json({ success: true, data: sale })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/:id/refund", async (req: AuthRequest, res: Response) => {
  try {
    const sale = await prisma.sale.findUnique({ where: { id: req.params.id }, include: { items: true } })
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" })
    if (sale.status === "refunded") return res.status(400).json({ success: false, message: "Already refunded" })

    await prisma.$transaction(async (tx) => {
      await tx.sale.update({ where: { id: sale.id }, data: { status: "refunded" } })
      for (const item of sale.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
      }
    })

    res.json({ success: true, message: "Sale refunded" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
