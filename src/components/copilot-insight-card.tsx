"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle, TrendingDown, Trophy, X, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type InsightType = "warning" | "danger" | "insight" | "win"

interface CopilotInsightCardProps {
  type: InsightType
  title: string
  body: string
  onDismiss?: () => void
  onDeepDive?: () => void
  onClick?: () => void
  cleared?: boolean
}

const typeConfig: Record<InsightType, {
  icon: typeof AlertTriangle
  borderClass: string
  bgClass: string
  iconClass: string
}> = {
  danger: {
    icon: AlertTriangle,
    borderClass: "border-destructive/20",
    bgClass: "bg-destructive/[0.03]",
    iconClass: "text-destructive",
  },
  warning: {
    icon: AlertCircle,
    borderClass: "border-amber-500/20",
    bgClass: "bg-amber-500/[0.03]",
    iconClass: "text-amber-500",
  },
  insight: {
    icon: TrendingDown,
    borderClass: "border-cyan-500/20",
    bgClass: "bg-cyan-500/[0.03]",
    iconClass: "text-cyan-500",
  },
  win: {
    icon: Trophy,
    borderClass: "border-emerald-500/20",
    bgClass: "bg-emerald-500/[0.03]",
    iconClass: "text-emerald-500",
  },
}

export function CopilotInsightCard({ type, title, body, onDismiss, onDeepDive, onClick, cleared }: CopilotInsightCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-lg border p-4 transition-all duration-200 outline-none",
        config.borderClass,
        config.bgClass,
        "hover:shadow-md",
        onClick && "cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        cleared && "opacity-50 grayscale border-border bg-transparent hover:shadow-none"
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.iconClass)} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-tight">{title}</p>
          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{body}</p>
        </div>
      </div>

      <div className={cn(
        "absolute top-3 right-3 flex items-center gap-1 transition-opacity duration-150",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        {onDeepDive && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeepDive?.() }}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            Deep Dive
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss?.() }}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
