import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, authorize, AuthRequest } from "../middleware/auth"
import { z } from "zod"
import { validate } from "../middleware/validate"

const router = Router()
router.use(authenticate)

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "cashier", "stock_controller"]),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
})

router.get("/", authorize("admin"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true, lastLogin: true },
      orderBy: { createdAt: "desc" },
    })
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, status: true, phone: true, avatar: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", authorize("admin"), async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: { id: true, name: true, email: true, role: true, status: true },
    })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", authorize("admin"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "User deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
