import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })))
const ProductsPage = lazy(() => import("@/pages/ProductsPage").then((m) => ({ default: m.ProductsPage })))
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })))
const CustomersPage = lazy(() => import("@/pages/CustomersPage").then((m) => ({ default: m.CustomersPage })))
const SuppliersPage = lazy(() => import("@/pages/SuppliersPage").then((m) => ({ default: m.SuppliersPage })))
const POSPage = lazy(() => import("@/pages/POSPage").then((m) => ({ default: m.POSPage })))
const SalesPage = lazy(() => import("@/pages/SalesPage").then((m) => ({ default: m.SalesPage })))
const PurchasesPage = lazy(() => import("@/pages/PurchasesPage").then((m) => ({ default: m.PurchasesPage })))
const EmployeesPage = lazy(() => import("@/pages/EmployeesPage").then((m) => ({ default: m.EmployeesPage })))
const ExpensesPage = lazy(() => import("@/pages/ExpensesPage").then((m) => ({ default: m.ExpensesPage })))
const ReportsPage = lazy(() => import("@/pages/ReportsPage").then((m) => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })))
const BranchesPage = lazy(() => import("@/pages/BranchesPage").then((m) => ({ default: m.BranchesPage })))
const InventoryPage = lazy(() => import("@/pages/InventoryPage").then((m) => ({ default: m.InventoryPage })))
const LoyaltyPage = lazy(() => import("@/pages/LoyaltyPage").then((m) => ({ default: m.LoyaltyPage })))

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "pos", element: <SuspenseWrapper><POSPage /></SuspenseWrapper> },
      { path: "products", element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> },
      { path: "categories", element: <SuspenseWrapper><CategoriesPage /></SuspenseWrapper> },
      { path: "customers", element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
      { path: "suppliers", element: <SuspenseWrapper><SuppliersPage /></SuspenseWrapper> },
      { path: "inventory", element: <SuspenseWrapper><InventoryPage /></SuspenseWrapper> },
      { path: "sales", element: <SuspenseWrapper><SalesPage /></SuspenseWrapper> },
      { path: "purchases", element: <SuspenseWrapper><PurchasesPage /></SuspenseWrapper> },
      { path: "employees", element: <SuspenseWrapper><EmployeesPage /></SuspenseWrapper> },
      { path: "expenses", element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper> },
      { path: "reports", element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper> },
      { path: "settings", element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
      { path: "branches", element: <SuspenseWrapper><BranchesPage /></SuspenseWrapper> },
      { path: "loyalty", element: <SuspenseWrapper><LoyaltyPage /></SuspenseWrapper> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
