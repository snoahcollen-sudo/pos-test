import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  Truck,
  Warehouse,
  BarChart3,
  Settings,
  CreditCard,
  ClipboardList,
  UserCog,
  Store,
  Receipt,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { useSidebarStore } from "@/stores/sidebarStore"

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
      { label: "POS", path: "/pos", icon: <ShoppingCart size={20} /> },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Products", path: "/products", icon: <Package size={20} /> },
      { label: "Categories", path: "/categories", icon: <FolderTree size={20} /> },
      { label: "Inventory", path: "/inventory", icon: <Warehouse size={20} /> },
      { label: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Sales History", path: "/sales", icon: <Receipt size={20} /> },
      { label: "Purchases", path: "/purchases", icon: <ClipboardList size={20} /> },
      { label: "Customers", path: "/customers", icon: <Users size={20} /> },
      { label: "Expenses", path: "/expenses", icon: <CreditCard size={20} /> },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Employees", path: "/employees", icon: <UserCog size={20} /> },
      { label: "Branches", path: "/branches", icon: <Store size={20} /> },
      { label: "Reports", path: "/reports", icon: <BarChart3 size={20} /> },
      { label: "Loyalty", path: "/loyalty", icon: <Gift size={20} /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
    ],
  },
]

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              SP
            </div>
            <span className="text-lg font-bold">SmartPOS</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 hover:bg-accent"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="scrollbar-thin h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
