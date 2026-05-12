"use client"

import { useQueryState } from "nuqs"
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SpendVector } from "@/lib/db/types"
import { DEPARTMENT_ORDER } from "@/lib/db/services"

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const GRID_COLS = "grid-cols-[minmax(0,1fr)_7rem_5rem_2rem]"

function varianceBadge(v: SpendVector["variance"]) {
  if (v.direction === "flat" || v.percent === 0) {
    return { text: "Flat", icon: Minus, className: "text-muted-foreground" }
  }
  const text = `${v.direction === "up" ? "+" : "-"}${v.percent.toFixed(1)}%`
  if (v.direction === "up") {
    return { text, icon: TrendingUp, className: "text-destructive" }
  }
  return { text, icon: TrendingDown, className: "text-success" }
}

interface SpendVectorCardProps extends SpendVector {
  revenue: number
  expanded: boolean
  onToggle: () => void
}

export function SpendVectorCard({
  name,
  totalAmount,
  revenuePercent,
  variance,
  components,
  revenue,
  expanded,
  onToggle,
}: SpendVectorCardProps) {
  const [, setDrawer] = useQueryState("drawer")
  const badge = varianceBadge(variance)
  const BadgeIcon = badge.icon
  const sorted = [...components].sort(
    (a, b) =>
      DEPARTMENT_ORDER.indexOf(a.label as typeof DEPARTMENT_ORDER[number]) -
      DEPARTMENT_ORDER.indexOf(b.label as typeof DEPARTMENT_ORDER[number])
  )

  return (
    <Card
      className="p-0 gap-0 border-border/60 shadow-sm cursor-pointer transition-colors duration-200 hover:bg-muted/50 dark:hover:bg-white/[0.02]"
      onClick={onToggle}
    >
      <div className={cn("grid items-center px-6 pt-4 pb-1", GRID_COLS)}>
        <div className="flex items-center gap-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {name}
          </p>
          <span className={cn("inline-flex items-center gap-1 text-xs font-medium", badge.className)}>
            <BadgeIcon className="h-3 w-3" />
            {badge.text}
          </span>
        </div>

        <p className="text-xl font-semibold font-mono tabular-nums tracking-tight text-right">
          {currencyFmt.format(totalAmount)}
        </p>

        <span className="text-sm font-mono tabular-nums text-brand-600 dark:text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded text-right block ml-auto">
          {(revenuePercent * 100).toFixed(1)}%
        </span>

        <div className="flex justify-end">
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              expanded ? "rotate-90" : ""
            )}
          />
        </div>
      </div>
      <div className={cn("grid items-start px-6 pt-0.5 pb-3", GRID_COLS)}>
        <span />
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 group-hover/card:text-muted-foreground transition-colors duration-200 text-right">
          Amount
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 group-hover/card:text-muted-foreground transition-colors duration-200 text-right">
          % of Rev
        </span>
        <span />
      </div>

      <div className="accordion-panel" data-open={expanded}>
        <div>
          <div className="border-t border-border/50 px-6 pb-4 pt-3">
            <div className="space-y-0">
              {sorted.map((c) => (
                <div
                  key={c.drawerId}
                  onClick={(e) => { e.stopPropagation(); setDrawer(c.drawerId) }}
                  className={cn(
                    "group/item grid items-center py-2 px-1 -mx-1 rounded cursor-pointer transition-colors",
                    "hover:bg-zinc-50/40 dark:hover:bg-zinc-900/40",
                    GRID_COLS
                  )}
                >
                  <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                    {c.label}
                  </span>

                  <span className="text-sm font-mono tabular-nums text-foreground text-right">
                    {currencyFmt.format(c.amount)}
                  </span>

                  <span className="text-sm font-mono tabular-nums text-brand-600 dark:text-brand-500 text-right">
                    {(c.amount / revenue * 100).toFixed(1)}%
                  </span>

                  <div className="flex justify-end">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
