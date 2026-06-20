import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, page = "1", limit = "20" } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { phone: { contains: String(search) } },
        { email: { contains: String(search), mode: "insensitive" } },
      ]
    }
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: "desc" } }),
      prisma.customer.count({ where }),
    ])
    res.json({ success: true, data: customers, pagination: { total, page: Number(page), limit: Number(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: req.params.id }, include: { sales: { take: 10, orderBy: { createdAt: "desc" } } } })
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" })
    res.json({ success: true, data: customer })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const customer = await prisma.customer.create({ data: req.body })
    res.status(201).json({ success: true, data: customer })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const customer = await prisma.customer.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: customer })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Customer deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
