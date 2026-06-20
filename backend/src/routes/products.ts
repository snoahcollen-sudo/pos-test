import { Router, Request, Response } from "express"
import { prisma } from "../server"
import { authenticate, authorize, AuthRequest } from "../middleware/auth"
import { z } from "zod"
import { validate } from "../middleware/validate"

const router = Router()
router.use(authenticate)

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  supplierId: z.string().optional(),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  stock: z.number().int().min(0).optional(),
  minimumStock: z.number().int().min(0).optional(),
  tax: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).max(100).optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, categoryId, status, page = "1", limit = "20" } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { sku: { contains: String(search), mode: "insensitive" } },
        { barcode: { contains: String(search) } },
      ]
    }
    if (categoryId) where.categoryId = String(categoryId)
    if (status) where.status = status

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, supplier: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ])
    res.json({ success: true, data: products, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, brand: true, supplier: true },
    })
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/", validate(productSchema), async (req: AuthRequest, res: Response) => {
  try {
    const productCount = await prisma.product.count()
    const sku = req.body.sku || `PRD-${String(productCount + 1).padStart(5, "0")}`
    const barcode = req.body.barcode || `${Date.now()}`
    const product = await prisma.product.create({
      data: { ...req.body, sku, barcode },
      include: { category: true },
    })
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: { category: true },
    })
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.delete("/:id", authorize("admin", "manager"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
