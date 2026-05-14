"use client"

import { useMemo } from "react"
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ProjectionPoint } from "@/lib/scenarios/types"

const chartConfig = {
  scenarioMrr: { label: "Scenario MRR", color: "var(--color-brand-300)" },
  baselineCash: { label: "Baseline Cash", color: "var(--color-muted-foreground)" },
  scenarioCash: { label: "Scenario Cash", color: "var(--color-brand-500)" },
  greenFill: { label: "Above Baseline", color: "var(--color-success)" },
  redFill: { label: "Below Baseline", color: "var(--color-destructive)" },
} satisfies ChartConfig

function OracleTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ payload: ProjectionPoint }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  if (!point) return null

  const delta = point.scenarioCash - point.baselineCash
  const deltaColor = delta >= 0 ? "text-success" : "text-destructive"
  const deltaSign = delta >= 0 ? "+" : ""

  return (
    <div className="rounded-lg border bg-background px-3 py-2.5 shadow-md min-w-[200px]">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-xs text-muted-foreground">Sandbox Cash</span>
          <span className="font-mono tabular-nums text-xs font-medium">
            ${(point.scenarioCash / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-xs text-muted-foreground">Baseline Cash</span>
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            ${(point.baselineCash / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="flex justify-between gap-6 border-t pt-1">
          <span className="text-xs text-muted-foreground">Delta</span>
          <span className={`font-mono tabular-nums text-xs font-semibold ${deltaColor}`}>
            {deltaSign}${(delta / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-xs text-muted-foreground">Runway</span>
          <span className="font-mono tabular-nums text-xs font-medium">
            {point.runway >= 99 ? "99+" : point.runway.toFixed(1)} mo
          </span>
        </div>
      </div>
    </div>
  )
}

interface OracleChartProps {
  data: ProjectionPoint[]
}

export function OracleChart({ data }: OracleChartProps) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        ...p,
        greenFill: p.scenarioCash,
        redFill: p.baselineCash,
      })),
    [data]
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">Cash Trajectory — Baseline vs Sandbox</CardTitle>
        <CardDescription>Dynamic based on scenario inputs.</CardDescription>
      </CardHeader>
      <div className="h-[400px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<OracleTooltipContent />}
            />
            <Bar
              dataKey="scenarioMrr"
              yAxisId="right"
              fill="var(--color-brand-300)"
              fillOpacity={0.15}
              stroke="none"
              radius={[4, 4, 0, 0]}
            />
            <Area
              type="monotone"
              dataKey="greenFill"
              yAxisId="left"
              fill="var(--color-success)"
              fillOpacity={0.12}
              stroke="none"
            />
            <Area
              type="monotone"
              dataKey="redFill"
              yAxisId="left"
              fill="var(--color-destructive)"
              fillOpacity={0.12}
              stroke="none"
            />
            <Area
              type="monotone"
              dataKey="baselineCash"
              yAxisId="left"
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="scenarioCash"
              yAxisId="left"
              stroke="var(--color-brand-500)"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
