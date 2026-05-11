"use client"

import { Area, ComposedChart, CartesianGrid, Line, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export interface ChartSeries {
  dataKey: string
  label: string
  color: string
  fillOpacity?: number
  renderAs?: "area" | "line"
}

export const CASH_BURN_SERIES: ChartSeries[] = [
  { dataKey: "cashBalance", label: "Cash Balance", color: "var(--color-primary)", fillOpacity: 0.3 },
  { dataKey: "netBurn", label: "Net Burn", color: "var(--color-destructive)", fillOpacity: 0.3 },
]

export const REVENUE_EXPENSE_SERIES: ChartSeries[] = [
  { dataKey: "revenue", label: "Revenue", color: "#2AAADA", fillOpacity: 0.2 },
  { dataKey: "expenses", label: "Expenses", color: "#a1a1aa", fillOpacity: 0.1, renderAs: "line" },
]

export const GROSS_MARGIN_SERIES: ChartSeries[] = [
  { dataKey: "grossMargin", label: "Gross Margin", color: "var(--color-brand-500)", fillOpacity: 0.3 },
]

export const OP_MARGIN_SERIES: ChartSeries[] = [
  { dataKey: "opMargin", label: "Operating Margin", color: "#f59e0b", fillOpacity: 0.2 },
]

export const NET_MARGIN_SERIES: ChartSeries[] = [
  { dataKey: "netMargin", label: "Net Margin", color: "#22c55e", fillOpacity: 0.2 },
]

export const REVENUE_TREND_SERIES: ChartSeries[] = [
  { dataKey: "revenue", label: "Revenue", color: "#2AAADA", fillOpacity: 0.2 },
]

export const COGS_TREND_SERIES: ChartSeries[] = [
  { dataKey: "cogs", label: "Direct Costs", color: "var(--color-destructive)", fillOpacity: 0.2 },
]

export const GROSS_PROFIT_SERIES: ChartSeries[] = [
  { dataKey: "grossProfit", label: "Gross Profit", color: "var(--color-primary)", fillOpacity: 0.2 },
  { dataKey: "cogs", label: "Direct Costs", color: "var(--color-destructive)", fillOpacity: 0.1, renderAs: "line" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FinancialChartProps {
  data: any[]
  series: ChartSeries[]
  xAxisKey?: string
  yAxisFormat?: "currency" | "percent"
  hideLegend?: boolean
}

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export function FinancialChart({ data, series, xAxisKey = "date", yAxisFormat = "currency", hideLegend = false }: FinancialChartProps) {
  const chartConfig = Object.fromEntries(
    series.map((s) => [s.dataKey, { label: s.label, color: s.color }])
  ) satisfies ChartConfig

  const colorMap = Object.fromEntries(series.map((s) => [s.dataKey, s.color]))

  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[250px]">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.dataKey} id={`fill-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={s.fillOpacity ?? 0.1} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} horizontal={false} />
        {!hideLegend && (
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingBottom: '16px', opacity: 0.8 }}
          />
        )}
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value)
            if (isNaN(date.getTime())) return value
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={(value) =>
            yAxisFormat === "percent"
              ? `${(value * 100).toFixed(0)}%`
              : `$${(value / 1000).toFixed(0)}k`
          }
          width={50}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => String(value)}
              formatter={(value, name, item, index) => {
                const formattedValue = yAxisFormat === "percent"
                  ? `${((value as number) * 100).toFixed(1)}%`
                  : currencyFmt.format(value as number)

                const row = (
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: colorMap[item.dataKey as string] ?? item.color }}
                    />
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as string]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formattedValue}
                      </span>
                    </div>
                  </div>
                )

                if (yAxisFormat === "percent") return row
                if (index !== series.length - 1) return row

                const payload = item.payload as Record<string, number>
                const revenue = payload.revenue ?? 0
                const expenses = payload.expenses ?? 0
                const net = revenue - expenses
                if (net === 0 && !payload.revenue) return row

                return (
                  <div className="flex flex-col w-full">
                    {row}
                    <div className="flex items-center gap-2 border-t border-border/40 pt-1.5 mt-1.5">
                      <div className="h-2.5 w-2.5 shrink-0" />
                      <div className="flex flex-1 items-center justify-between gap-4">
                        <span className="text-muted-foreground font-medium">Net</span>
                        <span className={cn("font-mono font-medium tabular-nums", net >= 0 ? "text-emerald-500" : "text-destructive")}>
                          {currencyFmt.format(net)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          }
        />
        {series.map((s) =>
          s.renderAs === "line" ? (
            <Line
              key={s.dataKey}
              type="linear"
              dataKey={s.dataKey}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          ) : (
            <Area
              key={s.dataKey}
              type="linear"
              dataKey={s.dataKey}
              stroke={s.color}
              fill={`url(#fill-${s.dataKey})`}
              fillOpacity={1}
              strokeWidth={2}
            />
          )
        )}
      </ComposedChart>
    </ChartContainer>
  )
}
