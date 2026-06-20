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
    const employees = await prisma.employee.findMany({ where, orderBy: { name: "asc" } })
    res.json({ success: true, data: employees })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const employee = await prisma.employee.create({ data: req.body })
    res.status(201).json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const employee = await prisma.employee.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/:id/attendance", async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await prisma.attendance.create({ data: { employeeId: req.params.id, clockIn: new Date(), ...req.body } })
    res.status(201).json({ success: true, data: attendance })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
