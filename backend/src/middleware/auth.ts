import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../server"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: string }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" })
    }
    next()
  }
}
