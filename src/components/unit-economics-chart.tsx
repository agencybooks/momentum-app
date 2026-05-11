"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { unitEconomicsTrend } from "@/lib/mock-data"

const chartConfig = {
  ltv: { label: "Lifetime Value", color: "var(--color-brand-500)" },
  cac: { label: "Blended CAC", color: "#a1a1aa" },
} satisfies ChartConfig

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function UnitEconomicsTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<Record<string, unknown>>; label?: string }) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as { ltv: number; cac: number }
  const ratio = (point.ltv / point.cac).toFixed(1)

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: "var(--color-brand-500)" }} />
          <div className="flex flex-1 items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">LTV</span>
            <span className="font-mono text-xs font-medium text-foreground tabular-nums">
              {currencyFmt.format(point.ltv)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: "#a1a1aa" }} />
          <div className="flex flex-1 items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">CAC</span>
            <span className="font-mono text-xs font-medium text-foreground tabular-nums">
              {currencyFmt.format(point.cac)}
            </span>
          </div>
        </div>
        <div className="border-t border-border/50 pt-1.5 mt-0.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 shrink-0" />
            <div className="flex flex-1 items-center justify-between gap-4">
              <span className="text-xs font-medium text-muted-foreground">LTV:CAC</span>
              <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                {ratio}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UnitEconomicsChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">Unit Economics — LTV vs Blended CAC</CardTitle>
        <CardDescription>Trailing 12-month trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[240px]">
          <AreaChart data={unitEconomicsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fill-ltv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fill-cac" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={50}
              domain={[0, "auto"]}
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={<UnitEconomicsTooltipContent />}
            />
            <Area
              type="monotone"
              dataKey="ltv"
              stroke="var(--color-brand-500)"
              fill="url(#fill-ltv)"
              fillOpacity={1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cac"
              stroke="#a1a1aa"
              fill="url(#fill-cac)"
              fillOpacity={1}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
