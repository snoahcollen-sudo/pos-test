import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("password", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@smartpos.com" },
    update: {},
    create: { name: "Admin User", email: "admin@smartpos.com", password: hashedPassword, role: "admin", phone: "+1234567890" },
  })

  const manager = await prisma.user.upsert({
    where: { email: "sarah@smartpos.com" },
    update: {},
    create: { name: "Sarah Manager", email: "sarah@smartpos.com", password: hashedPassword, role: "manager", phone: "+1234567891" },
  })

  const cashier = await prisma.user.upsert({
    where: { email: "mike@smartpos.com" },
    update: {},
    create: { name: "Mike Cashier", email: "mike@smartpos.com", password: hashedPassword, role: "cashier", phone: "+1234567892" },
  })

  const stockController = await prisma.user.upsert({
    where: { email: "lisa@smartpos.com" },
    update: {},
    create: { name: "Lisa Stock", email: "lisa@smartpos.com", password: hashedPassword, role: "stock_controller", phone: "+1234567893" },
  })

  console.log("Users created")

  const electronics = await prisma.category.create({ data: { name: "Electronics", description: "Phones, laptops, gadgets", color: "#3b82f6", icon: "Cpu" } })
  const groceries = await prisma.category.create({ data: { name: "Groceries", description: "Food and beverages", color: "#22c55e", icon: "Apple" } })
  const hardware = await prisma.category.create({ data: { name: "Hardware", description: "Tools and equipment", color: "#f59e0b", icon: "Wrench" } })
  const clothing = await prisma.category.create({ data: { name: "Clothing", description: "Apparel and accessories", color: "#ec4899", icon: "Shirt" } })
  const pharmacy = await prisma.category.create({ data: { name: "Pharmacy", description: "Medicines and health", color: "#8b5cf6", icon: "Pill" } })

  console.log("Categories created")

  const supplier1 = await prisma.supplier.create({ data: { name: "TechWholesale Inc.", phone: "+1234567901", email: "orders@techwholesale.com", address: "100 Tech Blvd" } })
  const supplier2 = await prisma.supplier.create({ data: { name: "FreshFoods Distributors", phone: "+1234567902", email: "supply@freshfoods.com", address: "200 Farm Lane" } })
  const supplier3 = await prisma.supplier.create({ data: { name: "Global Hardware Supply", phone: "+1234567903", email: "info@globalhw.com", address: "300 Industrial Dr" } })

  console.log("Suppliers created")

  const products = [
    { name: "iPhone 15 Pro Max", sku: "ELE-00001", barcode: "1234567890123", categoryId: electronics.id, supplierId: supplier1.id, costPrice: 999, sellingPrice: 1299, stock: 25, minimumStock: 5, tax: 10, unit: "piece" },
    { name: "MacBook Air M3", sku: "ELE-00002", barcode: "1234567890124", categoryId: electronics.id, supplierId: supplier1.id, costPrice: 1199, sellingPrice: 1499, stock: 15, minimumStock: 3, tax: 10, unit: "piece" },
    { name: "Samsung Galaxy S24", sku: "ELE-00003", barcode: "1234567890125", categoryId: electronics.id, supplierId: supplier1.id, costPrice: 799, sellingPrice: 999, stock: 30, minimumStock: 8, tax: 10, unit: "piece" },
    { name: "Organic Whole Milk", sku: "GRO-00001", barcode: "2234567890123", categoryId: groceries.id, supplierId: supplier2.id, costPrice: 2.5, sellingPrice: 3.99, stock: 150, minimumStock: 20, tax: 5, unit: "liter" },
    { name: "Fresh Bread Loaf", sku: "GRO-00002", barcode: "2234567890124", categoryId: groceries.id, supplierId: supplier2.id, costPrice: 1.0, sellingPrice: 2.49, stock: 80, minimumStock: 15, tax: 5, unit: "piece" },
    { name: "Power Drill Set", sku: "HAR-00001", barcode: "3234567890123", categoryId: hardware.id, supplierId: supplier3.id, costPrice: 45, sellingPrice: 79.99, stock: 40, minimumStock: 10, tax: 8, unit: "set" },
    { name: "Cotton T-Shirt", sku: "CLO-00001", barcode: "4234567890123", categoryId: clothing.id, costPrice: 8, sellingPrice: 19.99, stock: 200, minimumStock: 30, tax: 8, unit: "piece" },
    { name: "Vitamin C Supplements", sku: "PHA-00001", barcode: "5234567890123", categoryId: pharmacy.id, costPrice: 12, sellingPrice: 24.99, stock: 3, minimumStock: 10, tax: 0, unit: "bottle" },
    { name: "Wireless Mouse", sku: "ELE-00004", barcode: "1234567890126", categoryId: electronics.id, supplierId: supplier1.id, costPrice: 15, sellingPrice: 29.99, stock: 75, minimumStock: 15, tax: 10, unit: "piece" },
    { name: "LED Desk Lamp", sku: "HAR-00002", barcode: "3234567890124", categoryId: hardware.id, supplierId: supplier3.id, costPrice: 20, sellingPrice: 44.99, stock: 45, minimumStock: 10, tax: 8, unit: "piece" },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p })
  }

  console.log("Products created")

  const customers = [
    { name: "John Smith", phone: "+1234567801", email: "john@email.com", address: "123 Main St", points: 1250, totalSpent: 4520, visitCount: 28 },
    { name: "Emma Wilson", phone: "+1234567802", email: "emma@email.com", address: "456 Oak Ave", points: 890, credit: 50, totalSpent: 2890, visitCount: 19 },
    { name: "Robert Brown", phone: "+1234567803", points: 2100, totalSpent: 8920, visitCount: 45 },
    { name: "Maria Garcia", phone: "+1234567804", email: "maria@email.com", address: "789 Pine Rd", points: 450, credit: 120, totalSpent: 1230, visitCount: 8 },
    { name: "David Lee", phone: "+1234567805", email: "david@email.com", points: 3200, totalSpent: 12500, visitCount: 62 },
  ]

  for (const c of customers) {
    await prisma.customer.create({ data: c })
  }

  console.log("Customers created")

  const expenses = [
    { category: "Rent", description: "Monthly store rent", amount: 3500, paymentMethod: "bank_transfer", date: new Date("2024-03-01") },
    { category: "Utilities", description: "Electricity bill", amount: 450, paymentMethod: "bank_transfer", date: new Date("2024-03-05") },
    { category: "Transport", description: "Delivery fuel", amount: 120, paymentMethod: "cash", date: new Date("2024-03-10") },
    { category: "Internet", description: "Monthly internet", amount: 89, paymentMethod: "card", date: new Date("2024-03-01") },
    { category: "Maintenance", description: "AC repair", amount: 280, paymentMethod: "cash", date: new Date("2024-03-12") },
  ]

  for (const e of expenses) {
    await prisma.expense.create({ data: e })
  }

  console.log("Expenses created")

  await prisma.storeSettings.create({
    data: {
      storeName: "SmartPOS Store",
      storePhone: "+1 234 567 890",
      storeEmail: "store@smartpos.com",
      storeAddress: "123 Business Street, City, Country",
      currency: "USD",
      taxRate: 10,
      receiptHeader: "Thank you for shopping with us!",
      receiptFooter: "Visit us again soon!",
    },
  })

  await prisma.branch.create({ data: { name: "Main Branch", address: "123 Main Street", phone: "+1 234 567 890" } })
  await prisma.branch.create({ data: { name: "Branch 2", address: "456 Oak Avenue" } })
  await prisma.branch.create({ data: { name: "Warehouse", address: "789 Industrial Road" } })

  console.log("Settings and branches created")
  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
