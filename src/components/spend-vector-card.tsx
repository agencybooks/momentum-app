"use client"

import { useQueryState } from "nuqs"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SpendVector } from "@/lib/db/types"

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function varianceBadge(v: SpendVector["variance"]) {
  if (v.direction === "flat" || v.percent === 0) {
    return { text: "—", className: "text-muted-foreground" }
  }
  const text = `${v.direction === "up" ? "+" : "-"}${v.percent.toFixed(1)}%`
  const className =
    v.direction === "up"
      ? "text-destructive"
      : "text-emerald-600 dark:text-emerald-400"
  return { text, className }
}

interface SpendVectorCardProps extends SpendVector {
  expanded: boolean
  onToggle: () => void
}

export function SpendVectorCard({
  name,
  totalAmount,
  revenuePercent,
  variance,
  components,
  expanded,
  onToggle,
}: SpendVectorCardProps) {
  const [, setDrawer] = useQueryState("drawer")
  const badge = varianceBadge(variance)

  return (
    <Card
      className="pt-5 px-5 pb-0 border-border/60 shadow-sm cursor-pointer transition-colors duration-200 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
      onClick={onToggle}
    >
      <div>
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {name}
          </p>
          <span className={cn("text-xs font-medium", badge.className)}>
            {badge.text}
          </span>
        </div>

        <p className="text-2xl font-semibold font-mono tabular-nums tracking-tight mt-1">
          {currencyFmt.format(totalAmount)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {(revenuePercent * 100).toFixed(1)}% of revenue
        </p>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            expanded ? "max-h-[300px] opacity-100 mt-3 pt-3 border-t border-border/50" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-0.5">
            {components.map((c) => (
              <div
                key={c.drawerId}
                onClick={(e) => { e.stopPropagation(); setDrawer(c.drawerId) }}
                className="group/item flex items-center justify-between py-1.5 px-1 -mx-1 rounded cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {c.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-mono tabular-nums text-foreground">
                    {currencyFmt.format(c.amount)}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-t py-3 flex items-center justify-between transition-all duration-200",
          expanded ? "border-border/50" : "border-border/10"
        )}
      >
        <span
          className={cn(
            "text-xs font-medium text-muted-foreground transition-opacity duration-200",
            expanded
              ? "opacity-100"
              : "opacity-0 group-hover/card:opacity-100"
          )}
        >
          {expanded ? "Collapse" : "View Breakdown"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-all duration-200",
            expanded
              ? "opacity-100 rotate-180"
              : "opacity-0 group-hover/card:opacity-100"
          )}
        />
      </div>
    </Card>
  )
}
