"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  TrendingUp,
  Wallet,
  Rocket,
  FlaskConical,
  Settings,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scorecards", href: "/scorecards", icon: ClipboardList },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Profitability", href: "/profitability", icon: TrendingUp },
  { label: "Cash", href: "/cash", icon: Wallet },
  { label: "Growth", href: "/growth", icon: Rocket },
  { label: "Scenarios", href: "/scenarios", icon: FlaskConical },
  { label: "Settings", href: "/settings", icon: Settings },
] as const

export function GlobalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center px-6">
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          Momentum
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="relative flex items-center justify-between border-t border-sidebar-border px-3 py-4">
        <Link 
          href="?drawer=action-center" 
          scroll={false}
          className="flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Action Center</span>
        </Link>
        <ThemeToggle />
      </div>
    </aside>
  )
}
