import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search } = req.query
    const where: any = {}
    if (search) where.OR = [{ name: { contains: String(search), mode: "insensitive" } }, { email: { contains: String(search), mode: "insensitive" } }]
    const suppliers = await prisma.supplier.findMany({ where, orderBy: { name: "asc" } })
    res.json({ success: true, data: suppliers })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: req.params.id }, include: { products: true, purchaseOrders: true } })
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" })
    res.json({ success: true, data: supplier })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body })
    res.status(201).json({ success: true, data: supplier })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await prisma.supplier.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: supplier })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Supplier deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
