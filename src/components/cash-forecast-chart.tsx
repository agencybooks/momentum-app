"use client"

import { Area, AreaChart, XAxis, YAxis, ReferenceLine, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cashForecastData, PAYROLL_FLOOR } from "@/lib/mock-data"

const chartConfig = {
  cash: { label: "Cash Balance", color: "var(--color-primary)" },
  inflows: { label: "Inflows", color: "var(--color-success)" },
  outflows: { label: "Outflows", color: "var(--color-destructive)" },
} satisfies ChartConfig

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function CashTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<Record<string, unknown>>; label?: string }) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as { cash: number; inflows?: number; outflows?: number }

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-primary" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Cash Balance</span>
            <span className="font-mono text-xs font-medium text-foreground tabular-nums">
              {currencyFmt.format(point.cash)}
            </span>
          </div>
        </div>
        {point.inflows !== undefined && (
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-success" />
            <div className="flex flex-1 items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Inflows</span>
              <span className="font-mono text-xs font-medium text-success tabular-nums">
                +{currencyFmt.format(point.inflows)}
              </span>
            </div>
          </div>
        )}
        {point.outflows !== undefined && (
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-destructive" />
            <div className="flex flex-1 items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Outflows</span>
              <span className="font-mono text-xs font-medium text-destructive tabular-nums">
                -{currencyFmt.format(point.outflows)}
              </span>
            </div>
          </div>
        )}
        <div className="border-t border-border/50 pt-1.5 mt-0.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] border border-destructive/50 border-dashed" />
            <div className="flex flex-1 items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Payroll Floor</span>
              <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
                {currencyFmt.format(PAYROLL_FLOOR)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CashForecastChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">13-Week Cash Forecast</CardTitle>
        <CardDescription>Weekly cash position with inflow/outflow breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[240px]">
          <AreaChart data={cashForecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fill-cash-forecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => value.replace("Week ", "W")}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={50}
              domain={[0, "auto"]}
            />
            <ReferenceLine
              y={PAYROLL_FLOOR}
              stroke="var(--color-destructive)"
              strokeDasharray="4 4"
              label={{
                value: "Payroll Floor ($31k)",
                position: "insideBottomLeft",
                fontSize: 12,
                fill: "var(--color-destructive)",
                dy: -10,
              }}
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={<CashTooltipContent />}
            />
            <Area
              type="monotone"
              dataKey="cash"
              stroke="var(--color-primary)"
              fill="url(#fill-cash-forecast)"
              fillOpacity={1}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
