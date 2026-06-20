import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { PrismaClient } from "@prisma/client"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"
import productRoutes from "./routes/products"
import categoryRoutes from "./routes/categories"
import customerRoutes from "./routes/customers"
import supplierRoutes from "./routes/suppliers"
import saleRoutes from "./routes/sales"
import purchaseRoutes from "./routes/purchases"
import expenseRoutes from "./routes/expenses"
import employeeRoutes from "./routes/employees"
import inventoryRoutes from "./routes/inventory"
import reportRoutes from "./routes/reports"
import dashboardRoutes from "./routes/dashboard"
import settingsRoutes from "./routes/settings"
import branchRoutes from "./routes/branches"
import notificationRoutes from "./routes/notifications"

export const prisma = new PrismaClient()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json({ limit: "10mb" }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
})
app.use("/api/", limiter)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/sales", saleRoutes)
app.use("/api/purchases", purchaseRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/branches", branchRoutes)
app.use("/api/notifications", notificationRoutes)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
