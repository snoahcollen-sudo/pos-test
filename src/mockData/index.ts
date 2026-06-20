import type {
  User,
  Product,
  Category,
  Customer,
  Supplier,
  Sale,
  Expense,
  Employee,
  DashboardStats,
  Notification,
  ActivityLog,
  PurchaseOrder,
} from "@/types"

export const mockUsers: User[] = [
  { id: "u1", name: "Admin User", email: "admin@smartpos.com", role: "admin", status: "active", phone: "+1234567890", createdAt: "2024-01-01T00:00:00Z", lastLogin: "2024-03-15T08:30:00Z" },
  { id: "u2", name: "Sarah Manager", email: "sarah@smartpos.com", role: "manager", status: "active", phone: "+1234567891", createdAt: "2024-01-15T00:00:00Z", lastLogin: "2024-03-15T07:45:00Z" },
  { id: "u3", name: "Mike Cashier", email: "mike@smartpos.com", role: "cashier", status: "active", phone: "+1234567892", createdAt: "2024-02-01T00:00:00Z", lastLogin: "2024-03-15T08:00:00Z" },
  { id: "u4", name: "Lisa Stock", email: "lisa@smartpos.com", role: "stock_controller", status: "active", phone: "+1234567893", createdAt: "2024-02-15T00:00:00Z" },
]

export const mockCategories: Category[] = [
  { id: "c1", name: "Electronics", description: "Phones, laptops, gadgets", icon: "Cpu", color: "#3b82f6", productCount: 45 },
  { id: "c2", name: "Groceries", description: "Food and beverages", icon: "Apple", color: "#22c55e", productCount: 120 },
  { id: "c3", name: "Hardware", description: "Tools and equipment", icon: "Wrench", color: "#f59e0b", productCount: 67 },
  { id: "c4", name: "Clothing", description: "Apparel and accessories", icon: "Shirt", color: "#ec4899", productCount: 89 },
  { id: "c5", name: "Pharmacy", description: "Medicines and health", icon: "Pill", color: "#8b5cf6", productCount: 156 },
  { id: "c6", name: "Home & Garden", description: "Furniture and decor", icon: "Home", color: "#14b8a6", productCount: 34 },
]

export const mockProducts: Product[] = [
  { id: "p1", name: "iPhone 15 Pro Max", sku: "ELE-00001", barcode: "1234567890123", categoryId: "c1", costPrice: 999, sellingPrice: 1299, stock: 25, minimumStock: 5, tax: 10, discount: 0, unit: "piece", status: "active", createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p2", name: "MacBook Air M3", sku: "ELE-00002", barcode: "1234567890124", categoryId: "c1", costPrice: 1199, sellingPrice: 1499, stock: 15, minimumStock: 3, tax: 10, discount: 5, unit: "piece", status: "active", createdAt: "2024-01-20T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p3", name: "Samsung Galaxy S24", sku: "ELE-00003", barcode: "1234567890125", categoryId: "c1", costPrice: 799, sellingPrice: 999, stock: 30, minimumStock: 8, tax: 10, discount: 0, unit: "piece", status: "active", createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p4", name: "Organic Whole Milk", sku: "GRO-00001", barcode: "2234567890123", categoryId: "c2", costPrice: 2.5, sellingPrice: 3.99, stock: 150, minimumStock: 20, tax: 5, discount: 0, unit: "liter", status: "active", createdAt: "2024-01-10T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p5", name: "Fresh Bread Loaf", sku: "GRO-00002", barcode: "2234567890124", categoryId: "c2", costPrice: 1.0, sellingPrice: 2.49, stock: 80, minimumStock: 15, tax: 5, discount: 0, unit: "piece", status: "active", createdAt: "2024-01-12T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p6", name: "Power Drill Set", sku: "HAR-00001", barcode: "3234567890123", categoryId: "c3", costPrice: 45, sellingPrice: 79.99, stock: 40, minimumStock: 10, tax: 8, discount: 10, unit: "set", status: "active", createdAt: "2024-02-05T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p7", name: "Cotton T-Shirt", sku: "CLO-00001", barcode: "4234567890123", categoryId: "c4", costPrice: 8, sellingPrice: 19.99, stock: 200, minimumStock: 30, tax: 8, discount: 0, unit: "piece", status: "active", createdAt: "2024-01-25T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p8", name: "Vitamin C Supplements", sku: "PHA-00001", barcode: "5234567890123", categoryId: "c5", costPrice: 12, sellingPrice: 24.99, stock: 3, minimumStock: 10, tax: 0, discount: 0, unit: "bottle", status: "active", createdAt: "2024-02-10T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p9", name: "Wireless Mouse", sku: "ELE-00004", barcode: "1234567890126", categoryId: "c1", costPrice: 15, sellingPrice: 29.99, stock: 75, minimumStock: 15, tax: 10, discount: 0, unit: "piece", status: "active", createdAt: "2024-02-15T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "p10", name: "LED Desk Lamp", sku: "HAR-00002", barcode: "3234567890124", categoryId: "c3", costPrice: 20, sellingPrice: 44.99, stock: 45, minimumStock: 10, tax: 8, discount: 15, unit: "piece", status: "active", createdAt: "2024-02-20T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
]

export const mockCustomers: Customer[] = [
  { id: "cu1", name: "John Smith", phone: "+1234567801", email: "john@email.com", address: "123 Main St", points: 1250, credit: 0, totalSpent: 4520, visitCount: 28, createdAt: "2024-01-05T00:00:00Z" },
  { id: "cu2", name: "Emma Wilson", phone: "+1234567802", email: "emma@email.com", address: "456 Oak Ave", points: 890, credit: 50, totalSpent: 2890, visitCount: 19, createdAt: "2024-01-10T00:00:00Z" },
  { id: "cu3", name: "Robert Brown", phone: "+1234567803", points: 2100, credit: 0, totalSpent: 8920, visitCount: 45, createdAt: "2024-01-15T00:00:00Z" },
  { id: "cu4", name: "Maria Garcia", phone: "+1234567804", email: "maria@email.com", address: "789 Pine Rd", points: 450, credit: 120, totalSpent: 1230, visitCount: 8, createdAt: "2024-02-01T00:00:00Z" },
  { id: "cu5", name: "David Lee", phone: "+1234567805", email: "david@email.com", points: 3200, credit: 0, totalSpent: 12500, visitCount: 62, createdAt: "2024-01-20T00:00:00Z" },
]

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "TechWholesale Inc.", phone: "+1234567901", email: "orders@techwholesale.com", address: "100 Tech Blvd", productsSupplied: 45, outstandingBalance: 2500, createdAt: "2024-01-01T00:00:00Z" },
  { id: "s2", name: "FreshFoods Distributors", phone: "+1234567902", email: "supply@freshfoods.com", address: "200 Farm Lane", productsSupplied: 120, outstandingBalance: 0, createdAt: "2024-01-05T00:00:00Z" },
  { id: "s3", name: "Global Hardware Supply", phone: "+1234567903", email: "info@globalhw.com", address: "300 Industrial Dr", productsSupplied: 67, outstandingBalance: 5000, createdAt: "2024-01-10T00:00:00Z" },
  { id: "s4", name: "FashionDirect Co.", phone: "+1234567904", email: "sales@fashiondirect.com", address: "400 Fashion Ave", productsSupplied: 89, outstandingBalance: 1200, createdAt: "2024-01-15T00:00:00Z" },
]

export const mockSales: Sale[] = [
  { id: "sa1", invoiceNumber: "INV-2024-001", customerId: "cu1", customerName: "John Smith", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si1", productId: "p1", productName: "iPhone 15 Pro Max", productSku: "ELE-00001", quantity: 1, price: 1299, costPrice: 999, discount: 0, tax: 129.9, total: 1428.9 }], subtotal: 1299, tax: 129.9, discount: 0, total: 1428.9, paymentMethod: "card", amountTendered: 1428.9, change: 0, status: "completed", createdAt: "2024-03-15T10:30:00Z" },
  { id: "sa2", invoiceNumber: "INV-2024-002", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si2", productId: "p4", productName: "Organic Whole Milk", productSku: "GRO-00001", quantity: 3, price: 3.99, costPrice: 2.5, discount: 0, tax: 0.6, total: 12.57 }], subtotal: 11.97, tax: 0.6, discount: 0, total: 12.57, paymentMethod: "cash", amountTendered: 15, change: 2.43, status: "completed", createdAt: "2024-03-15T11:15:00Z" },
  { id: "sa3", invoiceNumber: "INV-2024-003", customerId: "cu2", customerName: "Emma Wilson", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si3", productId: "p2", productName: "MacBook Air M3", productSku: "ELE-00002", quantity: 1, price: 1499, costPrice: 1199, discount: 74.95, tax: 142.41, total: 1566.46 }], subtotal: 1424.05, tax: 142.41, discount: 74.95, total: 1491.51, paymentMethod: "bank_transfer", amountTendered: 1491.51, change: 0, status: "completed", createdAt: "2024-03-15T14:00:00Z" },
  { id: "sa4", invoiceNumber: "INV-2024-004", customerId: "cu5", customerName: "David Lee", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si4", productId: "p6", productName: "Power Drill Set", productSku: "HAR-00001", quantity: 2, price: 79.99, costPrice: 45, discount: 16, tax: 12.16, total: 156.15 }, { id: "si5", productId: "p10", productName: "LED Desk Lamp", productSku: "HAR-00002", quantity: 1, price: 44.99, costPrice: 20, discount: 6.75, tax: 3.12, total: 41.36 }], subtotal: 184.97, tax: 15.28, discount: 22.75, total: 177.5, paymentMethod: "mobile_money", amountTendered: 177.5, change: 0, status: "completed", createdAt: "2024-03-15T15:30:00Z" },
  { id: "sa5", invoiceNumber: "INV-2024-005", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si6", productId: "p7", productName: "Cotton T-Shirt", productSku: "CLO-00001", quantity: 4, price: 19.99, costPrice: 8, discount: 0, tax: 6.4, total: 86.36 }], subtotal: 79.96, tax: 6.4, discount: 0, total: 86.36, paymentMethod: "cash", amountTendered: 100, change: 13.64, status: "completed", createdAt: "2024-03-14T09:45:00Z" },
  { id: "sa6", invoiceNumber: "INV-2024-006", customerId: "cu3", customerName: "Robert Brown", cashierId: "u3", cashierName: "Mike Cashier", items: [{ id: "si7", productId: "p3", productName: "Samsung Galaxy S24", productSku: "ELE-00003", quantity: 1, price: 999, costPrice: 799, discount: 0, tax: 99.9, total: 1098.9 }], subtotal: 999, tax: 99.9, discount: 0, total: 1098.9, paymentMethod: "card", amountTendered: 1098.9, change: 0, status: "completed", createdAt: "2024-03-14T16:20:00Z" },
]

export const mockExpenses: Expense[] = [
  { id: "e1", category: "Rent", description: "Monthly store rent", amount: 3500, date: "2024-03-01", paymentMethod: "bank_transfer" },
  { id: "e2", category: "Utilities", description: "Electricity bill", amount: 450, date: "2024-03-05", paymentMethod: "bank_transfer" },
  { id: "e3", category: "Transport", description: "Delivery fuel", amount: 120, date: "2024-03-10", paymentMethod: "cash" },
  { id: "e4", category: "Internet", description: "Monthly internet", amount: 89, date: "2024-03-01", paymentMethod: "card" },
  { id: "e5", category: "Maintenance", description: "AC repair", amount: 280, date: "2024-03-12", paymentMethod: "cash" },
  { id: "e6", category: "Supplies", description: "Office supplies", amount: 65, date: "2024-03-14", paymentMethod: "card" },
]

export const mockEmployees: Employee[] = [
  { id: "u1", name: "Admin User", email: "admin@smartpos.com", phone: "+1234567890", role: "admin", salary: 5000, commission: 0, status: "active", hireDate: "2024-01-01", attendance: [] },
  { id: "u2", name: "Sarah Manager", email: "sarah@smartpos.com", phone: "+1234567891", role: "manager", salary: 3500, commission: 2, status: "active", hireDate: "2024-01-15", attendance: [] },
  { id: "u3", name: "Mike Cashier", email: "mike@smartpos.com", phone: "+1234567892", role: "cashier", salary: 2000, commission: 1, status: "active", hireDate: "2024-02-01", attendance: [] },
  { id: "u4", name: "Lisa Stock", email: "lisa@smartpos.com", phone: "+1234567893", role: "stock_controller", salary: 2200, commission: 0, status: "active", hireDate: "2024-02-15", attendance: [] },
]

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po1", orderNumber: "PO-2024-001", supplierId: "s1", supplierName: "TechWholesale Inc.", items: [{ id: "pi1", productId: "p1", productName: "iPhone 15 Pro Max", quantity: 50, costPrice: 999, total: 49950 }], total: 49950, status: "pending", paymentStatus: "unpaid", expectedDelivery: "2024-04-01", createdAt: "2024-03-15T00:00:00Z" },
  { id: "po2", orderNumber: "PO-2024-002", supplierId: "s2", supplierName: "FreshFoods Distributors.", items: [{ id: "pi2", productId: "p4", productName: "Organic Whole Milk", quantity: 200, costPrice: 2.5, total: 500 }], total: 500, status: "received", paymentStatus: "paid", expectedDelivery: "2024-03-20", createdAt: "2024-03-10T00:00:00Z" },
]

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Low Stock Alert", message: "Vitamin C Supplements is running low (3 units left)", type: "warning", read: false, createdAt: "2024-03-15T08:00:00Z" },
  { id: "n2", title: "New Order Received", message: "PO-2024-001 from TechWholesale Inc.", type: "info", read: false, createdAt: "2024-03-15T09:30:00Z" },
  { id: "n3", title: "Payment Received", message: "Card payment of $1,428.90 processed", type: "success", read: true, createdAt: "2024-03-15T10:35:00Z" },
  { id: "n4", title: "Daily Report Ready", message: "Yesterday's sales report is available", type: "info", read: true, createdAt: "2024-03-15T06:00:00Z" },
]

export const mockActivityLogs: ActivityLog[] = [
  { id: "al1", userId: "u3", userName: "Mike Cashier", action: "Sale Completed", details: "Invoice INV-2024-001 - $1,428.90", createdAt: "2024-03-15T10:30:00Z" },
  { id: "al2", userId: "u3", userName: "Mike Cashier", action: "Sale Completed", details: "Invoice INV-2024-002 - $12.57", createdAt: "2024-03-15T11:15:00Z" },
  { id: "al3", userId: "u1", userName: "Admin User", action: "Product Updated", details: "iPhone 15 Pro Max - Price updated", createdAt: "2024-03-15T09:00:00Z" },
  { id: "al4", userId: "u2", userName: "Sarah Manager", action: "Purchase Order Created", details: "PO-2024-001 from TechWholesale Inc.", createdAt: "2024-03-15T08:45:00Z" },
]

export const mockDashboardStats: DashboardStats = {
  todaySales: 3118.47,
  todayProfit: 892.30,
  weeklySales: 18750.25,
  monthlySales: 72450.80,
  totalProducts: 450,
  lowStockCount: 12,
  totalCustomers: 256,
  totalSuppliers: 18,
  recentTransactions: mockSales.slice(0, 5),
  topProducts: [
    { name: "iPhone 15 Pro Max", quantity: 25, revenue: 32475 },
    { name: "MacBook Air M3", quantity: 15, revenue: 22485 },
    { name: "Samsung Galaxy S24", quantity: 30, revenue: 29970 },
    { name: "Cotton T-Shirt", quantity: 89, revenue: 1779.11 },
    { name: "Power Drill Set", quantity: 40, revenue: 3199.60 },
  ],
  salesChart: [
    { date: "Mon", sales: 2450, profit: 735 },
    { date: "Tue", sales: 3120, profit: 936 },
    { date: "Wed", sales: 2890, profit: 867 },
    { date: "Thu", sales: 3450, profit: 1035 },
    { date: "Fri", sales: 4200, profit: 1260 },
    { date: "Sat", sales: 5100, profit: 1530 },
    { date: "Sun", sales: 3118, profit: 892 },
  ],
  bestCashier: { name: "Mike Cashier", sales: 12500, transactions: 45 },
  inventoryValue: 285000,
}
