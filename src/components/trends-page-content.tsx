"use client"

import { useMemo, useCallback } from "react"
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs"
import { Card } from "@/components/ui/card"
import { TREND_METRICS, TREND_COLORS, buildTrendsTimeline } from "@/lib/trends/trends-data"
import type { TrendMetric } from "@/lib/trends/types"
import { MetricControlBoard } from "@/components/trends/metric-control-board"
import { GlobalDateRange } from "@/components/trends/global-date-range"
import { CorrelationChart } from "@/components/trends/correlation-chart"

const MAX_METRICS = 3

export function TrendsPageContent() {
  const [selectedIds, setSelectedIds] = useQueryState(
    "metrics",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [range, setRange] = useQueryState(
    "range",
    parseAsString.withDefault("ttm")
  )

  const timeline = useMemo(() => buildTrendsTimeline(), [])

  const filteredData = useMemo(() => {
    if (range === "ytd") return timeline.filter((d) => d.month !== "Dec")
    return timeline
  }, [timeline, range])

  const selectedMetrics = useMemo(
    () => selectedIds
      .map((id) => TREND_METRICS.find((m) => m.id === id))
      .filter((m): m is TrendMetric => m != null),
    [selectedIds]
  )

  const colorMap = useMemo(
    () => new Map(selectedMetrics.map((m, i) => [m.id, TREND_COLORS[i]])),
    [selectedMetrics]
  )

  const toggleMetric = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev.filter((m) => m !== id)
        if (prev.length >= MAX_METRICS) return prev
        return [...prev, id]
      })
    },
    [setSelectedIds]
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Trends</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overlay up to 3 metrics to discover correlations and hidden business physics.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="w-[280px] shrink-0">
          <MetricControlBoard
            metrics={TREND_METRICS}
            selected={selectedIds}
            onToggle={toggleMetric}
            colorMap={colorMap}
            atLimit={selectedIds.length >= MAX_METRICS}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-end mb-4">
            <GlobalDateRange value={range} onChange={setRange} />
          </div>

          <Card className="p-6">
            <CorrelationChart
              data={filteredData}
              selectedMetrics={selectedMetrics}
              colorMap={colorMap}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
