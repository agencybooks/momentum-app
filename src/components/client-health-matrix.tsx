"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { formatCurrency, formatCurrencyFull } from "@/lib/format"
import type { EnrichedClient } from "@/lib/db/types"

interface ScatterPoint {
  name: string
  mrr: number
  marginPct: number
  isDanger: boolean
}

const BRAND_COLOR = "var(--color-brand-500)"
const DANGER_COLOR = "var(--color-destructive)"

const chartConfig = {
  mrr: { label: "MRR" },
  marginPct: { label: "Gross Margin %" },
} satisfies ChartConfig

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

function HealthTooltipContent({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ScatterPoint }>
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-md">
      <p className="text-sm font-medium">{d.name}</p>
      <div className="flex justify-between gap-6 mt-1.5">
        <span className="text-xs text-muted-foreground">MRR</span>
        <span className="text-xs font-mono tabular-nums text-right">
          {formatCurrencyFull(d.mrr)}
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-xs text-muted-foreground">Gross Margin</span>
        <span className="text-xs font-mono tabular-nums text-right font-medium">
          {d.marginPct.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export function ClientHealthMatrix({
  clients,
}: {
  clients: EnrichedClient[]
}) {
  const { points, medianMrr, medianMargin } = useMemo(() => {
    const active = clients.filter((c) => c.mrr > 0)
    if (active.length === 0)
      return { points: [] as ScatterPoint[], medianMrr: 0, medianMargin: 0 }

    const mrrMedian = median(active.map((c) => c.mrr))
    const marginMedian = median(active.map((c) => c.margin * 100))

    const mapped: ScatterPoint[] = active.map((c) => ({
      name: c.name,
      mrr: c.mrr,
      marginPct: c.margin * 100,
      isDanger: c.mrr >= mrrMedian && c.margin * 100 < marginMedian,
    }))

    return { points: mapped, medianMrr: mrrMedian, medianMargin: marginMedian }
  }, [clients])

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Client Health Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[260px]">
          <p className="text-sm text-muted-foreground">
            No active clients to display.
          </p>
        </CardContent>
      </Card>
    )
  }

  const mrrValues = points.map((p) => p.mrr)
  const marginValues = points.map((p) => p.marginPct)
  const mrrMin = Math.min(...mrrValues)
  const mrrMax = Math.max(...mrrValues)
  const marginMin = Math.min(...marginValues)
  const marginMax = Math.max(...marginValues)
  const mrrPad = (mrrMax - mrrMin) * 0.1
  const marginPad = (marginMax - marginMin) * 0.15

  return (
    <Card>
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">
          Client Health Matrix
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          X = MRR · Y = Gross Margin %
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <ChartContainer
          config={chartConfig}
          className="min-h-[260px] w-full aspect-auto"
        >
          <ScatterChart
            margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
          >
            <XAxis
              dataKey="mrr"
              type="number"
              domain={[mrrMin - mrrPad, mrrMax + mrrPad]}
              tickFormatter={(v: number) => formatCurrency(v)}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="var(--muted-foreground)"
              tickCount={4}
            />
            <YAxis
              dataKey="marginPct"
              type="number"
              domain={[
                Math.floor(marginMin - marginPad),
                Math.ceil(marginMax + marginPad),
              ]}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="var(--muted-foreground)"
              width={42}
              tickCount={5}
            />
            <ReferenceLine
              x={medianMrr}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
            />
            <ReferenceLine
              y={medianMargin}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
            />
            <Tooltip
              content={<HealthTooltipContent />}
              cursor={false}
            />
            <Scatter data={points} isAnimationActive={false}>
              {points.map((p) => (
                <Cell
                  key={p.name}
                  fill={p.isDanger ? DANGER_COLOR : BRAND_COLOR}
                  r={7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: "var(--color-brand-500)" }}
            />
            Healthy
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />
            Danger Zone
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
