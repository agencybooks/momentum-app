"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { baselineTrajectoryData } from "@/lib/mock-data"

const chartConfig = {
  cash: { label: "Cash Balance", color: "var(--color-primary)" },
  projected: { label: "Projected", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig

export function BaselineTrajectoryChart() {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Baseline Trajectory (Trailing 90D Pace)
        </CardTitle>
        <p className="text-lg">
          If you change nothing, your cash runway will stabilize at{" "}
          <strong className="font-semibold text-primary">6.2 months</strong>, and MRR will
          plateau at <strong className="font-semibold text-primary">$45.2K/mo</strong> by
          December.
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[200px]">
          <AreaChart data={baselineTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fill-baseline-cash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fill-baseline-projected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-muted-foreground)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-muted-foreground)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={50}
              domain={[0, "auto"]}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<ChartTooltipContent />}
            />
            <Area
              type="monotone"
              dataKey="cash"
              stroke="var(--color-primary)"
              fill="url(#fill-baseline-cash)"
              fillOpacity={1}
              strokeWidth={2}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="var(--color-muted-foreground)"
              strokeDasharray="6 3"
              fill="url(#fill-baseline-projected)"
              fillOpacity={1}
              strokeWidth={2}
              connectNulls={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
