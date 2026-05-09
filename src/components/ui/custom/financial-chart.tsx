"use client"

import * as React from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { CashFlowTimeline } from "@/lib/db/types"

const chartConfig = {
  cashBalance: {
    label: "Cash Balance",
    color: "hsl(var(--primary))",
  },
  netBurn: {
    label: "Net Burn",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

interface FinancialChartProps {
  data: CashFlowTimeline[]
}

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[250px]">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillCashBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-cashBalance)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-cashBalance)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillNetBurn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-netBurn)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-netBurn)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          width={50}
        />
        <ChartTooltip 
          cursor={false} 
          content={
            <ChartTooltipContent 
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
              }}
            />
          } 
        />
        <Area
          type="monotone"
          dataKey="cashBalance"
          stroke="var(--color-cashBalance)"
          fill="url(#fillCashBalance)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="netBurn"
          stroke="var(--color-netBurn)"
          fill="url(#fillNetBurn)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
