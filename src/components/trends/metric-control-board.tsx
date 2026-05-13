"use client"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { TrendMetric } from "@/lib/trends/types"

const GROUP_LABELS: Record<TrendMetric["group"], string> = {
  revenue: "Revenue",
  profitability: "Profitability",
  liquidity: "Liquidity",
}

const GROUP_ORDER: TrendMetric["group"][] = ["revenue", "profitability", "liquidity"]

interface MetricControlBoardProps {
  metrics: TrendMetric[]
  selected: string[]
  onToggle: (id: string) => void
  colorMap: Map<string, string>
  atLimit: boolean
}

export function MetricControlBoard({
  metrics,
  selected,
  onToggle,
  colorMap,
  atLimit,
}: MetricControlBoardProps) {
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: metrics.filter((m) => m.group === group),
  }))

  return (
    <div className="space-y-5">
      {grouped.map(({ group, label, items }) => (
        <div key={group}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            {label}
          </p>
          <div className="space-y-1">
            {items.map((metric) => {
              const isSelected = selected.includes(metric.id)
              const color = colorMap.get(metric.id)
              const disabled = atLimit && !isSelected

              return (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => onToggle(metric.id)}
                  disabled={disabled}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-all",
                    "hover:bg-accent/50",
                    disabled && "opacity-40 pointer-events-none"
                  )}
                >
                  <div
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-[3px] border transition-colors",
                      isSelected ? "border-transparent" : "border-border"
                    )}
                    style={isSelected && color ? { backgroundColor: color } : undefined}
                  />
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(metric.id)}
                    className="sr-only"
                    tabIndex={-1}
                  />
                  <span className={cn(
                    "transition-colors",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {metric.label}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground/60 font-mono">
                    {metric.unit === "$" ? "$" : metric.unit === "%" ? "%" : metric.unit === "ratio" ? "x" : "d"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
