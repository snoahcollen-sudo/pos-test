import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "20" } = req.query
    const where: any = {}
    if (category) where.category = String(category)
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({ where, skip: (Number(page) - 1) * Number(limit), take: Number(limit), orderBy: { date: "desc" } }),
      prisma.expense.count({ where }),
    ])
    res.json({ success: true, data: expenses, pagination: { total, page: Number(page), limit: Number(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const expense = await prisma.expense.create({ data: req.body })
    res.status(201).json({ success: true, data: expense })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: expense })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Expense deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
