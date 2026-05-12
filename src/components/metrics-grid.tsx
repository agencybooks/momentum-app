"use client"

import { useQueryState } from "nuqs"
import { MetricAnchor, type MetricAnchorProps } from "@/components/metric-anchor"
import { sparklineTrendUp, sparklineTrendDown } from "@/lib/mock-data"

export interface MetricWithDrawer extends Omit<MetricAnchorProps, "onClick" | "sparklineData"> {
  id: string
  drawerId?: string
}

export function MetricsGrid({ metrics, columns = 4 }: { metrics: MetricWithDrawer[]; columns?: 3 | 4 | 5 }) {
  const [, setDrawer] = useQueryState("drawer")

  const gridClass = {
    3: "grid grid-cols-1 md:grid-cols-3 gap-4",
    4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    5: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4",
  }[columns]

  return (
    <div className={gridClass}>
      {metrics.map((metric) => {
        let trendPositive: boolean
        if (metric.trendDirection && metric.trendUp !== undefined) {
          trendPositive = metric.trendDirection === "up-is-good" ? metric.trendUp : !metric.trendUp
        } else {
          trendPositive = metric.trendUp ?? metric.isHealthy
        }

        return (
          <MetricAnchor
            key={metric.id}
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
        )
      })}
    </div>
  )
}
