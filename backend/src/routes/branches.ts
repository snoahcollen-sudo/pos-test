import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } })
    res.json({ success: true, data: branches })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const branch = await prisma.branch.create({ data: req.body })
    res.status(201).json({ success: true, data: branch })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const branch = await prisma.branch.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: branch })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.branch.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Branch deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
