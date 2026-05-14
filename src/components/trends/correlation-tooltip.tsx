"use client"

import { cn } from "@/lib/utils"
import type { TrendMetric, TrendsTimelinePoint } from "@/lib/trends/types"
import { formatMetricValue } from "@/lib/trends/trends-data"

interface CorrelationTooltipProps {
  active?: boolean
  payload?: Array<{ payload: TrendsTimelinePoint }>
  label?: string
  metrics: TrendMetric[]
  colors: Map<string, string>
  data: TrendsTimelinePoint[]
}

export function CorrelationTooltip({
  active,
  payload,
  label,
  metrics,
  colors,
  data,
}: CorrelationTooltipProps) {
  if (!active || !payload?.length || !label) return null

  const monthIdx = data.findIndex((d) => d.month === label)
  const prior = monthIdx > 0 ? data[monthIdx - 1] : null

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2.5 shadow-xl min-w-[220px]">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        {metrics.map((metric) => {
          const current = payload[0]?.payload?.[metric.dataKey] as number | undefined
          if (current == null) return null

          const priorVal = prior?.[metric.dataKey] as number | undefined
          const delta = priorVal != null ? current - priorVal : null

          const deltaFavorable =
            delta != null
              ? metric.unit === "days"
                ? delta <= 0
                : delta >= 0
              : null

          return (
            <div key={metric.id} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: colors.get(metric.id) }}
              />
              <div className="flex flex-1 items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs font-medium tabular-nums">
                    {formatMetricValue(current, metric.unit)}
                  </span>
                  {delta != null && (
                    <span
                      className={cn(
                        "font-mono text-xs tabular-nums",
                        deltaFavorable ? "text-success" : "text-destructive"
                      )}
                    >
                      {delta >= 0 ? "+" : ""}
                      {formatMetricValue(delta, metric.unit)} MoM
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
