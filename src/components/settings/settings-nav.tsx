"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Bell, Shield, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const personalItems = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Security", href: "/settings/security", icon: Shield },
] as const

const adminItems = [
  { label: "Team & Access", href: "/settings/team", icon: Users },
  { label: "Billing & Plan", href: "/settings/billing", icon: CreditCard },
] as const

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-60 shrink-0 border-r border-border/40 dark:border-white/10 pr-6 sticky top-0 self-start">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-3">
          Personal Workspace
        </p>
        {personalItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-brand-600 dark:text-brand-400")} />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-3">
          Agency Administration
        </p>
        {adminItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-brand-600 dark:text-brand-400")} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function SettingsNavMobile() {
  const pathname = usePathname()
  const allItems = [...personalItems, ...adminItems]

  return (
    <nav className="md:hidden flex overflow-x-auto gap-1 border-b border-border/40 dark:border-white/10 pb-3 mb-6 -mx-2 px-2">
      {allItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors shrink-0",
              isActive
                ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
