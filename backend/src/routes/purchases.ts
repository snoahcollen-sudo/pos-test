import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus } = req.query
    const where: any = {}
    if (status) where.status = status
    if (paymentStatus) where.paymentStatus = paymentStatus
    const orders = await prisma.purchaseOrder.findMany({ where, include: { items: { include: { product: true } }, supplier: true }, orderBy: { createdAt: "desc" } })
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({ where: { id: req.params.id }, include: { items: { include: { product: true } }, supplier: true, payments: true } })
    if (!order) return res.status(404).json({ success: false, message: "Order not found" })
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const orderCount = await prisma.purchaseOrder.count()
    const orderNumber = `PO-${new Date().getFullYear()}-${String(orderCount + 1).padStart(3, "0")}`
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId: req.body.supplierId,
        total: req.body.total,
        expectedDelivery: req.body.expectedDelivery,
        notes: req.body.notes,
        items: { create: req.body.items.map((item: any) => ({ productId: item.productId, quantity: item.quantity, costPrice: item.costPrice, total: item.quantity * item.costPrice })) },
      },
      include: { items: true, supplier: true },
    })
    res.status(201).json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id/receive", async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({ where: { id: req.params.id }, include: { items: true } })
    if (!order) return res.status(404).json({ success: false, message: "Order not found" })

    await prisma.$transaction(async (tx) => {
      await tx.purchaseOrder.update({ where: { id: order.id }, data: { status: "received" } })
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
        await tx.stockMovement.create({ data: { type: "purchase", quantity: item.quantity, productId: item.productId, reference: order.orderNumber } })
      }
    })
    res.json({ success: true, message: "Order received and stock updated" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
