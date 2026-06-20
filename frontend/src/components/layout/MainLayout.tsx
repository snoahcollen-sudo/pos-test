import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./TopNav"
import { useSidebarStore } from "@/stores/sidebarStore"
import { cn } from "@/utils/cn"

export function MainLayout() {
  const { isCollapsed } = useSidebarStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("transition-all duration-300", isCollapsed ? "ml-[68px]" : "ml-[260px]")}>
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
