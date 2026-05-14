"use client"

import { useMemo, useCallback } from "react"
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TREND_METRICS, TREND_COLORS, buildTrendsTimeline } from "@/lib/trends/trends-data"
import type { TrendMetric } from "@/lib/trends/types"
import { MetricControlBoard } from "@/components/trends/metric-control-board"
import { GlobalDateRange } from "@/components/trends/global-date-range"
import { CorrelationChart } from "@/components/trends/correlation-chart"
import { PageHeader } from "@/components/page-header"

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
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Trends"
        subtitle="Overlay up to 3 metrics to discover correlations and hidden business physics."
      />

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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground tracking-tight">Correlation Analysis</CardTitle>
              <CardDescription>Overlay up to 3 metrics to spot patterns across time.</CardDescription>
            </CardHeader>
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
