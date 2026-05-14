"use client"

import { useQueryState } from "nuqs"
import { MetricAnchor, type MetricAnchorProps } from "@/components/metric-anchor"
import { sparklineTrendUp, sparklineTrendDown } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export interface MetricWithDrawer extends Omit<MetricAnchorProps, "onClick" | "sparklineData"> {
  id: string
  drawerId?: string
}

export function MetricsGrid({ metrics, columns = 4 }: { metrics: MetricWithDrawer[]; columns?: 3 | 4 | 5 }) {
  const [, setDrawer] = useQueryState("drawer")

  const xlGridCols = {
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
  }[columns]

  return (
    <div className="relative -mx-4 xl:mx-0 after:absolute after:right-0 after:top-0 after:h-full after:w-8 after:bg-gradient-to-l after:from-background after:pointer-events-none xl:after:hidden">
      <div
        className={cn(
          "flex gap-4 overflow-x-auto px-4",
          "xl:grid xl:overflow-x-visible xl:px-0",
          "snap-x snap-mandatory xl:snap-none",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          xlGridCols
        )}
      >
        {metrics.map((metric) => {
          let trendPositive: boolean
          if (metric.trendDirection && metric.trendUp !== undefined) {
            trendPositive = metric.trendDirection === "up-is-good" ? metric.trendUp : !metric.trendUp
          } else {
            trendPositive = metric.trendUp ?? metric.isHealthy
          }

          return (
            <div key={metric.id} className="snap-start shrink-0 w-[260px] xl:w-auto">
              <MetricAnchor
                title={metric.title}
                value={metric.value}
                target={metric.target}
                trendText={metric.trendText}
                trendUp={metric.trendUp}
                trendDirection={metric.trendDirection}
                isHealthy={metric.isHealthy}
                onClick={metric.drawerId ? () => { setDrawer(metric.drawerId!) } : undefined}
                sparklineData={trendPositive ? sparklineTrendUp : sparklineTrendDown}
                sentiment={trendPositive ? "positive" : "negative"}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
