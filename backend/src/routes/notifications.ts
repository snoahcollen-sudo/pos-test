import { Router, Response } from "express"
import { prisma } from "../server"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authenticate)

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" }, take: 50 })
    res.json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } })
    res.json({ success: true, message: "Notification marked as read" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.id, read: false }, data: { read: true } })
    res.json({ success: true, message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
