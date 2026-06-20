import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, Moon, Sun, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useThemeStore } from "@/stores/themeStore"
import { useAuthStore } from "@/stores/authStore"
import { getInitials } from "@/utils/cn"
import { notificationApi } from "@/services/notificationApi"

export function TopNav() {
  const { theme, setTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => { fetchNotifications() }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getAll()
      setNotifications(data.data)
    } catch {
      setNotifications([
        { id: "n1", title: "Low Stock Alert", message: "Vitamin C Supplements is running low", type: "warning", read: false, createdAt: new Date().toISOString() },
        { id: "n2", title: "New Order Received", message: "PO-2024-001 from TechWholesale", type: "info", read: false, createdAt: new Date().toISOString() },
        { id: "n3", title: "Payment Received", message: "Card payment of $1,428.90", type: "success", read: true, createdAt: new Date().toISOString() },
      ])
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => { logout(); navigate("/login") }

  const handleMarkAllRead = async () => {
    try { await notificationApi.markAllRead(); setNotifications(notifications.map((n) => ({ ...n, read: true }))) }
    catch {}
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products, customers, orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{unreadCount}</span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-lg border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>Mark all read</Button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={cn("border-b p-4 last:border-0", !n.read && "bg-primary/5")}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                      {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs capitalize text-muted-foreground">{user?.role || "admin"}</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 rounded-lg border bg-card shadow-lg">
              <div className="p-2">
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"><User size={16} /> Profile</button>
                <button onClick={() => { navigate("/settings"); setShowProfile(false) }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"><Settings size={16} /> Settings</button>
                <hr className="my-1" />
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut size={16} /> Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
