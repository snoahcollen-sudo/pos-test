export type UserRole = "admin" | "manager" | "cashier" | "stock_controller"

export type UserStatus = "active" | "inactive" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  createdAt: string
  lastLogin?: string
}

export interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  categoryId: string
  brandId?: string
  supplierId?: string
  costPrice: number
  sellingPrice: number
  stock: number
  minimumStock: number
  tax: number
  discount: number
  image?: string
  description?: string
  unit: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  description?: string
  logo?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  points: number
  credit: number
  totalSpent: number
  visitCount: number
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  productsSupplied: number
  outstandingBalance: number
  createdAt: string
}

export interface Sale {
  id: string
  invoiceNumber: string
  customerId?: string
  customerName?: string
  cashierId: string
  cashierName: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  amountTendered: number
  change: number
  status: "completed" | "refunded" | "voided"
  createdAt: string
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  price: number
  costPrice: number
  discount: number
  tax: number
  total: number
}

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile_money" | "gift_card" | "store_credit"

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  paymentMethod: string
  reference?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  salary: number
  commission: number
  status: "active" | "inactive"
  hireDate: string
  attendance: AttendanceRecord[]
}

export interface AttendanceRecord {
  date: string
  clockIn: string
  clockOut?: string
  status: "present" | "absent" | "late" | "leave"
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  items: PurchaseItem[]
  total: number
  status: "pending" | "received" | "cancelled"
  paymentStatus: "unpaid" | "partial" | "paid"
  expectedDelivery: string
  createdAt: string
}

export interface PurchaseItem {
  id: string
  productId: string
  productName: string
  quantity: number
  costPrice: number
  total: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  createdAt: string
}

export interface DashboardStats {
  todaySales: number
  todayProfit: number
  weeklySales: number
  monthlySales: number
  totalProducts: number
  lowStockCount: number
  totalCustomers: number
  totalSuppliers: number
  recentTransactions: Sale[]
  topProducts: { name: string; quantity: number; revenue: number }[]
  salesChart: { date: string; sales: number; profit: number }[]
  bestCashier: { name: string; sales: number; transactions: number }
  inventoryValue: number
}

export interface StoreSettings {
  storeName: string
  storePhone: string
  storeEmail: string
  storeAddress: string
  storeLogo?: string
  currency: string
  taxRate: number
  receiptHeader: string
  receiptFooter: string
  lowStockThreshold: number
}

export type Theme = "light" | "dark" | "system"
