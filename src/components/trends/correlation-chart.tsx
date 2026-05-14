"use client"

import { useMemo } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart as LineChartIcon } from "lucide-react"
import type { TrendMetric, TrendsTimelinePoint, MetricUnit } from "@/lib/trends/types"
import { formatAxisTick } from "@/lib/trends/trends-data"
import { CorrelationTooltip } from "./correlation-tooltip"

interface AxisConfig {
  id: string
  unit: MetricUnit
  orientation: "left" | "right"
  visible: boolean
}

interface CorrelationChartProps {
  data: TrendsTimelinePoint[]
  selectedMetrics: TrendMetric[]
  colorMap: Map<string, string>
}

export function CorrelationChart({ data, selectedMetrics, colorMap }: CorrelationChartProps) {
  const axes = useMemo(() => {
    const units = [...new Set(selectedMetrics.map((m) => m.unit))]
    const configs: AxisConfig[] = []

    const hasDollar = units.includes("$")
    const nonDollar = units.filter((u) => u !== "$")

    if (hasDollar) {
      configs.push({ id: "axis-dollar", unit: "$", orientation: "left", visible: true })
    }

    nonDollar.forEach((unit, i) => {
      const isFirst = i === 0
      configs.push({
        id: `axis-${unit}`,
        unit,
        orientation: hasDollar || !isFirst ? "right" : "left",
        visible: isFirst || !hasDollar,
      })
    })

    if (configs.length === 0 && units.length > 0) {
      configs.push({ id: `axis-${units[0]}`, unit: units[0], orientation: "left", visible: true })
    }

    return configs
  }, [selectedMetrics])

  const axisIdByUnit = useMemo(
    () => new Map(axes.map((a) => [a.unit, a.id])),
    [axes]
  )

  const chartKey = selectedMetrics.map((m) => m.id).join(",")

  const chartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    selectedMetrics.forEach((m) => {
      const color = colorMap.get(m.id)
      if (color) cfg[m.dataKey] = { label: m.label, color }
    })
    return cfg satisfies ChartConfig
  }, [selectedMetrics, colorMap])

  if (selectedMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-border/50 rounded-lg">
        <LineChartIcon className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No metrics selected</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Choose up to 3 metrics from the control board to discover correlations.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[500px]">
      <ChartContainer key={chartKey} config={chartConfig} className="w-full h-full">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />

          {axes.map((axis) => (
            <YAxis
              key={axis.id}
              yAxisId={axis.id}
              orientation={axis.orientation}
              tickFormatter={axis.visible ? (v) => formatAxisTick(v, axis.unit) : () => ""}
              tickLine={false}
              axisLine={false}
              width={axis.visible ? 60 : 0}
              tick={axis.visible ? { fill: "var(--muted-foreground)", fontSize: 11 } : false}
            />
          ))}

          <ChartTooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
            content={
              <CorrelationTooltip
                metrics={selectedMetrics}
                colors={colorMap}
                data={data}
              />
            }
          />

          {selectedMetrics.map((metric) => {
            const color = colorMap.get(metric.id) ?? "var(--color-primary)"
            const yAxisId = axisIdByUnit.get(metric.unit) ?? axes[0]?.id ?? "left"

            if (metric.renderAs === "bar") {
              return (
                <Bar
                  key={metric.dataKey}
                  dataKey={metric.dataKey}
                  yAxisId={yAxisId}
                  fill={color}
                  fillOpacity={0.2}
                  stroke={color}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  isAnimationActive={true}
                  animationDuration={400}
                />
              )
            }

            return (
              <Line
                key={metric.dataKey}
                type="monotone"
                dataKey={metric.dataKey}
                yAxisId={yAxisId}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={true}
                animationDuration={400}
              />
            )
          })}
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
