import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../server"
import { z } from "zod"
import { validate } from "../middleware/validate"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "manager", "cashier", "stock_controller"]).optional(),
  phone: z.string().optional(),
})

router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }
    if (user.status !== "active") {
      return res.status(401).json({ success: false, message: "Account is suspended" })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role }
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: 900 } as any)
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET!, { expiresIn: 604800 } as any)

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "cashier", phone },
    })
    res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token" })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string; email: string; role: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Invalid refresh token" })
    }
    const tokenPayload = { id: user.id, email: user.email, role: user.role }
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: 900 } as any)
    const newRefreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET!, { expiresIn: 604800 } as any)
    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } })
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid refresh token" })
  }
})

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, status: true, phone: true, avatar: true, createdAt: true },
    })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
