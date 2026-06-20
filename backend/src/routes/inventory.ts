import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, productId } = req.query
    const where: any = {}
    if (type) where.type = type
    if (productId) where.productId = productId
    const movements = await prisma.stockMovement.findMany({ where, include: { product: true, warehouse: true }, orderBy: { date: "desc" }, take: 100 })
    res.json({ success: true, data: movements })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/adjust", async (req: Request, res: Response) => {
  try {
    const { productId, quantity, type, reference, notes } = req.body
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantity } } })
      await tx.stockMovement.create({ data: { type: type || "adjustment", quantity, productId, reference, notes } })
    })
    res.json({ success: true, message: "Stock adjusted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/transfer", async (req: Request, res: Response) => {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body
    await prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({ data: { type: "transfer_out", quantity: -quantity, productId, warehouseId: fromWarehouseId, reference: `Transfer to ${toWarehouseId}` } })
      await tx.stockMovement.create({ data: { type: "transfer_in", quantity, productId, warehouseId: toWarehouseId, reference: `Transfer from ${fromWarehouseId}` } })
    })
    res.json({ success: true, message: "Stock transferred" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
