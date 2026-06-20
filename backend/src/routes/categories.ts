import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })
    res.json({ success: true, data: categories.map((c) => ({ ...c, productCount: c._count.products })) })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.category.create({ data: req.body })
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: category })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Category deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
