import { cn } from "@/utils/cn"
import { Inbox, Package, ShoppingCart, Users, FolderOpen, AlertCircle } from "lucide-react"

const icons = {
  inbox: Inbox,
  package: Package,
  cart: ShoppingCart,
  users: Users,
  folder: FolderOpen,
  alert: AlertCircle,
}

interface EmptyStateProps {
  icon?: keyof typeof icons
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon = "inbox", title, description, action, className }: EmptyStateProps) {
  const Icon = icons[icon]
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
