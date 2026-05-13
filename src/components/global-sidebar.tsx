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
  LineChart,
  FlaskConical,
  Gauge,
  Settings,
  Command,
  ChevronsUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scorecards", href: "/scorecards", icon: ClipboardList },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Profitability", href: "/profitability", icon: TrendingUp },
  { label: "Cash", href: "/cash", icon: Wallet },
  { label: "Growth", href: "/growth", icon: Rocket },
  { label: "Trends", href: "/trends", icon: LineChart },
  { label: "Scenarios", href: "/scenarios", icon: FlaskConical },
] as const

const bottomNavItems = [
  { label: "Calibration", href: "/calibration", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings },
] as const

export function GlobalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border/40 bg-background dark:bg-zinc-950 dark:border-white/10">
      <div className="px-4 pt-4">
        <div className="group flex items-center gap-3 px-2 py-2 mb-6 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
            <Command className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold tracking-tight text-foreground text-sm">Momentum OS</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-1 py-2">
        <div className="flex-1">
          {mainNavItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer mb-1 mx-2",
                  isActive
                    ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                {label}
              </Link>
            )
          })}
        </div>
        <div className="border-t border-border/40 dark:border-white/10 mx-4 my-2" />
        <div>
          {bottomNavItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer mb-1 mx-2",
                  isActive
                    ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <ThemeToggle />
      </div>
    </aside>
  )
}
