"use client"

import { useDeferredValue } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { MathEquation, type MathStep } from "./math-equation"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { leverageTrendData, type LeverageTrendPoint } from "@/lib/mock-data"

export type LeverKey = "acquire" | "expand" | "dealSize" | "retain"

interface LeverageDeepDiveDrawerProps {
  leverKey: LeverKey
  value: number[]
  onValueChange: (val: number[]) => void
  liftAmount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface LeverSpec {
  title: string
  sliderLabel: string
  sliderUnit: string
  min: number
  max: number
  step: number
  chartDataKey: keyof LeverageTrendPoint
  chartLabel: string
  yAxisFormat: "count" | "percent" | "currency" | "points"
  alertMessage: (val: number, lift: number) => string
  mathFn: (val: number, lift: number) => MathStep[]
  referenceValueFn: (val: number) => number
}

const LEVER_SPECS: Record<LeverKey, LeverSpec> = {
  acquire: {
    title: "Lever 1: Acquisition",
    sliderLabel: "Target Logos / Month",
    sliderUnit: "logos/mo",
    min: 0,
    max: 10,
    step: 0.5,
    chartDataKey: "acquisitions",
    chartLabel: "New Logos Won",
    yAxisFormat: "count",
    alertMessage: (val, lift) =>
      `At ${val.toFixed(1)} new logos/mo with a $5,000 average ACV, acquisition alone contributes +$${(lift / 1000).toFixed(1)}K/mo in new MRR. Historical average is 1.5 logos/mo over the trailing 12 months.`,
    mathFn: (val, lift) => [
      {
        left: { value: val.toFixed(1), label: "New Logos" },
        operator: "times",
        right: { value: "$5,000", label: "Avg ACV" },
        result: {
          value: `+$${(lift / 1000).toFixed(1)}K`,
          label: "MRR Lift",
        },
      },
    ],
    referenceValueFn: (val) => val,
  },
  expand: {
    title: "Lever 2: Expansion",
    sliderLabel: "Expansion Lift %",
    sliderUnit: "%",
    min: 0,
    max: 20,
    step: 1,
    chartDataKey: "expansionPct",
    chartLabel: "Expansion Rate",
    yAxisFormat: "percent",
    alertMessage: (val, lift) =>
      `A ${val}% expansion lift applied to 20% of the $310K eligible base yields +$${(lift / 1000).toFixed(1)}K/mo. Trailing 12-month average expansion rate is 4.2%, making a ${val}% target ${val <= 5 ? "achievable" : "aggressive"}.`,
    mathFn: (val, lift) => {
      const subtotal = (310000 * val) / 100
      return [
        {
          left: { value: "$310K", label: "Base MRR" },
          operator: "times",
          right: { value: `${val}%`, label: "Lift %" },
          result: {
            value: `$${(subtotal / 1000).toFixed(1)}K`,
            label: "Subtotal",
          },
        },
        {
          left: {
            value: `$${(subtotal / 1000).toFixed(1)}K`,
            label: "Subtotal",
          },
          operator: "times",
          right: { value: "20%", label: "Eligible %" },
          result: {
            value: `+$${(lift / 1000).toFixed(1)}K`,
            label: "MRR Lift",
          },
        },
      ]
    },
    referenceValueFn: (val) => val,
  },
  dealSize: {
    title: "Lever 3: Deal Size",
    sliderLabel: "Avg Deal Size Increase",
    sliderUnit: "%",
    min: 0,
    max: 50,
    step: 1,
    chartDataKey: "avgDealSize",
    chartLabel: "Average Deal Size",
    yAxisFormat: "currency",
    alertMessage: (val, lift) =>
      `Increasing average deal size by ${val}% from the $26K baseline adds +$${(lift / 1000).toFixed(1)}K/mo. Trailing 12-month average deal size is $25.7K with a gradual uptrend.`,
    mathFn: (val, lift) => [
      {
        left: { value: "$26K", label: "Avg Deal" },
        operator: "times",
        right: { value: `${val}%`, label: "Increase" },
        result: {
          value: `+$${(lift / 1000).toFixed(1)}K`,
          label: "MRR Lift",
        },
      },
    ],
    referenceValueFn: (val) => 26000 * (1 + val / 100),
  },
  retain: {
    title: "Lever 4: Retention",
    sliderLabel: "Churn Reduction",
    sliderUnit: "pt",
    min: 0,
    max: 5,
    step: 0.5,
    chartDataKey: "churnRate",
    chartLabel: "Monthly Churn Rate",
    yAxisFormat: "points",
    alertMessage: (val, lift) =>
      `Reducing churn by ${val.toFixed(1)} points on $30K at-risk MRR recovers +$${(lift / 1000).toFixed(1)}K/mo. Current churn rate is 2.0%, and the trailing 12-month trend shows steady improvement from 2.8%.`,
    mathFn: (val, lift) => [
      {
        left: { value: "$30K", label: "At-Risk MRR" },
        operator: "times",
        right: { value: `${val.toFixed(1)}pt`, label: "Recovery" },
        result: {
          value: `+$${(lift / 1000).toFixed(1)}K`,
          label: "MRR Lift",
        },
      },
    ],
    referenceValueFn: (val) => 2.0 - val,
  },
}

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function formatAxisValue(value: number, format: LeverSpec["yAxisFormat"]) {
  switch (format) {
    case "count":
      return `${value}`
    case "percent":
      return `${value.toFixed(1)}%`
    case "currency":
      return `$${(value / 1000).toFixed(0)}K`
    case "points":
      return `${value.toFixed(1)}%`
  }
}

function formatCellValue(value: number, format: LeverSpec["yAxisFormat"]) {
  switch (format) {
    case "count":
      return `${value}`
    case "percent":
      return `${value.toFixed(1)}%`
    case "currency":
      return currencyFmt.format(value)
    case "points":
      return `${value.toFixed(1)}%`
  }
}

function formatDelta(
  diff: number,
  format: LeverSpec["yAxisFormat"],
  downIsGood: boolean
) {
  const sign = diff >= 0 ? "+" : ""
  let text: string
  switch (format) {
    case "count":
      text = `${sign}${diff}`
      break
    case "percent":
      text = `${sign}${diff.toFixed(1)}pp`
      break
    case "currency":
      text =
        diff >= 0
          ? `+$${(diff / 1000).toFixed(1)}K`
          : `-$${(Math.abs(diff) / 1000).toFixed(1)}K`
      break
    case "points":
      text = `${sign}${diff.toFixed(1)}pp`
      break
  }

  const isPositive = downIsGood ? diff < 0 : diff > 0
  const color =
    diff === 0
      ? "text-muted-foreground"
      : isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-destructive"

  return { text, color }
}

const chartConfig: ChartConfig = {
  metric: {
    label: "Metric",
    color: "#2AAADA",
  },
}

function FeasibilityChart({
  spec,
  targetValue,
}: {
  spec: LeverSpec
  targetValue: number
}) {
  const dataKey = spec.chartDataKey
  const data = leverageTrendData.map((p) => ({
    month: p.month.replace(" 25", "").replace(" 26", ""),
    value: p[dataKey] as number,
  }))

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Trailing 12-Month Performance
      </h3>
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="leverFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2AAADA" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2AAADA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            tickFormatter={(v) => formatAxisValue(v, spec.yAxisFormat)}
            width={48}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2AAADA"
            strokeWidth={2}
            fill="url(#leverFill)"
          />
          <ReferenceLine
            y={targetValue}
            stroke="#2AAADA"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: "Your Target",
              position: "insideTopRight",
              fill: "#2AAADA",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function VarianceLedger({
  spec,
}: {
  spec: LeverSpec
}) {
  const dataKey = spec.chartDataKey
  const downIsGood = spec.chartDataKey === "churnRate"
  const data = [...leverageTrendData].reverse()

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Period Comparison
      </h3>
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-20">
              Month
            </th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">
              Value
            </th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-24">
              MoM Delta
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, i) => {
            const originalIndex = leverageTrendData.length - 1 - i
            const value = point[dataKey] as number
            const prevValue =
              originalIndex > 0
                ? (leverageTrendData[originalIndex - 1][dataKey] as number)
                : null

            const formattedValue = formatCellValue(value, spec.yAxisFormat)

            let delta: { text: string; color: string }
            if (prevValue === null) {
              delta = { text: "—", color: "text-muted-foreground" }
            } else {
              delta = formatDelta(
                value - prevValue,
                spec.yAxisFormat,
                downIsGood
              )
            }

            return (
              <tr
                key={point.month}
                className="border-b border-border/30 last:border-0 transition-colors hover:bg-accent/30"
              >
                <td className="py-2 font-mono tabular-nums text-muted-foreground">
                  {point.month}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {formattedValue}
                </td>
                <td
                  className={`py-2 text-right font-mono tabular-nums ${delta.color}`}
                >
                  {delta.text}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function LeverageDeepDiveDrawer({
  leverKey,
  value,
  onValueChange,
  liftAmount,
  open,
  onOpenChange,
}: LeverageDeepDiveDrawerProps) {
  const spec = LEVER_SPECS[leverKey]
  const deferredValue = useDeferredValue(value[0])
  const targetValue = spec.referenceValueFn(deferredValue)
  const mathSteps = spec.mathFn(value[0], liftAmount)
  const alertMsg = spec.alertMessage(value[0], liftAmount)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[95vw] sm:w-[var(--drawer-width-master)] overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <div className="px-4">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold tracking-tight uppercase">
                {spec.title}
              </SheetTitle>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-3xl font-bold font-mono tabular-nums text-success">
                  +${(liftAmount / 1000).toFixed(1)}K/mo
                </span>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  {value[0]}
                  {spec.sliderUnit === "logos/mo"
                    ? " logos/mo"
                    : spec.sliderUnit === "%"
                      ? "% target"
                      : `pt reduction`}
                </Badge>
              </div>
            </SheetHeader>
            <Separator className="my-6" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            {/* Insight Banner */}
            <div className="w-full border rounded-lg flex items-start gap-3 p-3 mb-6 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                {alertMsg}
              </span>
            </div>

            {/* Replica Slider */}
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Adjust Target
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    value={value}
                    onValueChange={(val) =>
                      onValueChange(
                        Array.isArray(val) ? [...val] : [val]
                      )
                    }
                    min={spec.min}
                    max={spec.max}
                    step={spec.step}
                    className="[&_[data-slot=slider-range]]:bg-brand-500/60"
                  />
                </div>
                <span className="text-sm font-mono tabular-nums font-medium w-32 text-right whitespace-nowrap">
                  {value[0]} {spec.sliderUnit}
                </span>
              </div>
            </div>

            {/* Visual Math Equation */}
            <MathEquation
              steps={mathSteps}
              label={`${spec.title} Calculation`}
            />

            {/* Feasibility Chart */}
            <FeasibilityChart spec={spec} targetValue={targetValue} />

            {/* Variance Ledger */}
            <VarianceLedger spec={spec} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
