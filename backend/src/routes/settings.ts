import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findFirst()
    if (!settings) settings = await prisma.storeSettings.create({ data: {} })
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/", async (req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findFirst()
    if (!settings) {
      settings = await prisma.storeSettings.create({ data: req.body })
    } else {
      settings = await prisma.storeSettings.update({ where: { id: settings.id }, data: req.body })
    }
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
