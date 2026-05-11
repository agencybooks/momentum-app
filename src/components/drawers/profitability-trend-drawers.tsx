"use client"

import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, TrendingUp, ArrowDown, ArrowUp } from "lucide-react"
import {
  FinancialChart,
  GROSS_MARGIN_SERIES,
  OP_MARGIN_SERIES,
  NET_MARGIN_SERIES,
  REVENUE_TREND_SERIES,
  COGS_TREND_SERIES,
  GROSS_PROFIT_SERIES,
  type ChartSeries,
} from "@/components/ui/custom/financial-chart"
import type { ProfitabilityTrendPoint } from "@/lib/db/types"

export const PROFITABILITY_TREND_DRAWER_IDS = [
  "gross-margin-trend",
  "op-margin-trend",
  "net-margin-trend",
  "revenue-trend",
  "cogs-trend",
  "gross-profit-trend",
] as const

const trendData: ProfitabilityTrendPoint[] = [
  { month: "Dec", revenue: 48000, cogs: 22800, grossProfit: 25200, opex: 15200, operatingProfit: 10000, otherExpenses: 1430, netIncome: 8570, grossMargin: 0.525, opMargin: 0.208, netMargin: 0.179 },
  { month: "Jan", revenue: 49500, cogs: 23500, grossProfit: 26000, opex: 15600, operatingProfit: 10400, otherExpenses: 1430, netIncome: 8970, grossMargin: 0.525, opMargin: 0.210, netMargin: 0.181 },
  { month: "Feb", revenue: 51000, cogs: 24200, grossProfit: 26800, opex: 16000, operatingProfit: 10800, otherExpenses: 1430, netIncome: 9370, grossMargin: 0.525, opMargin: 0.212, netMargin: 0.184 },
  { month: "Mar", revenue: 52500, cogs: 25000, grossProfit: 27500, opex: 16400, operatingProfit: 11100, otherExpenses: 1430, netIncome: 9670, grossMargin: 0.524, opMargin: 0.211, netMargin: 0.184 },
  { month: "Apr", revenue: 53800, cogs: 26300, grossProfit: 27500, opex: 16200, operatingProfit: 11300, otherExpenses: 1430, netIncome: 9870, grossMargin: 0.511, opMargin: 0.210, netMargin: 0.183 },
  { month: "May", revenue: 55000, cogs: 27445, grossProfit: 27555, opex: 17105, operatingProfit: 10450, otherExpenses: 1430, netIncome: 9020, grossMargin: 0.501, opMargin: 0.190, netMargin: 0.164 },
]

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const compactCurrency = (v: number) => `$${(v / 1000).toFixed(1)}K`

interface MathStep {
  left: { value: string; label: string }
  operator: "plus" | "minus" | "divided by"
  right: { value: string; label: string }
  result: { value: string; label: string }
}

interface DrawerAction {
  label: string
  variant: "primary" | "outline"
}

interface DrawerSpec {
  title: string
  alertType: "warning" | "success"
  alertMessage: string
  series: ChartSeries[]
  yAxisFormat: "currency" | "percent"
  headerValue: string
  headerDelta: string
  headerDeltaDirection: "down" | "up"
  proofLabel: string
  mathSteps: MathStep[]
  actions: DrawerAction[]
}

function getDrawerSpec(drawerId: string): DrawerSpec {
  const current = trendData[trendData.length - 1]
  const prior = trendData[trendData.length - 2]
  const first = trendData[0]

  switch (drawerId) {
    case "gross-margin-trend":
      return {
        title: "Gross Margin Trend",
        alertType: "warning",
        alertMessage: `Gross margin declined 2.4pp over 6 months (52.5% → 50.1%). COGS growth (+${currencyFmt.format(current.cogs - first.cogs)}) outpacing revenue growth, driven by hosting (+15%) and software (+14%) cost increases.`,
        series: GROSS_MARGIN_SERIES,
        yAxisFormat: "percent",
        headerValue: `${(current.grossMargin * 100).toFixed(1)}%`,
        headerDelta: `${((first.grossMargin - current.grossMargin) * 100).toFixed(1)}pp`,
        headerDeltaDirection: "down",
        proofLabel: "Gross Margin Calculation",
        mathSteps: [
          {
            left: { value: compactCurrency(current.revenue), label: "Revenue" },
            operator: "minus",
            right: { value: compactCurrency(current.cogs), label: "COGS" },
            result: { value: compactCurrency(current.grossProfit), label: "Gross Profit" },
          },
          {
            left: { value: compactCurrency(current.grossProfit), label: "Gross Profit" },
            operator: "divided by",
            right: { value: compactCurrency(current.revenue), label: "Revenue" },
            result: { value: `${(current.grossMargin * 100).toFixed(1)}%`, label: "Margin" },
          },
        ],
        actions: [
          { label: "Review License Utilization", variant: "outline" },
          { label: "Audit COGS Vendors", variant: "primary" },
        ],
      }
    case "op-margin-trend":
      return {
        title: "Operating Margin Trend",
        alertType: "warning",
        alertMessage: `Operating margin compressed 2.1pp this month (21.0% → 19.0%). OpEx spike from marketing (+24%) and subscriptions (+4%) while gross profit growth stalled.`,
        series: OP_MARGIN_SERIES,
        yAxisFormat: "percent",
        headerValue: `${(current.opMargin * 100).toFixed(1)}%`,
        headerDelta: `${((prior.opMargin - current.opMargin) * 100).toFixed(1)}pp`,
        headerDeltaDirection: "down",
        proofLabel: "Operating Margin Calculation",
        mathSteps: [
          {
            left: { value: compactCurrency(current.grossProfit), label: "Gross Profit" },
            operator: "minus",
            right: { value: compactCurrency(current.opex), label: "OpEx" },
            result: { value: compactCurrency(current.operatingProfit), label: "Op. Profit" },
          },
          {
            left: { value: compactCurrency(current.operatingProfit), label: "Op. Profit" },
            operator: "divided by",
            right: { value: compactCurrency(current.revenue), label: "Revenue" },
            result: { value: `${(current.opMargin * 100).toFixed(1)}%`, label: "Margin" },
          },
        ],
        actions: [
          { label: "Review OpEx Categories", variant: "outline" },
          { label: "Audit Marketing Spend", variant: "primary" },
        ],
      }
    case "net-margin-trend":
      return {
        title: "Net Profit Margin Trend",
        alertType: "warning",
        alertMessage: `Net margin dropped 1.9pp in May (18.3% → 16.4%). Combined pressure from COGS growth and OpEx increases eroding bottom-line profitability despite steady revenue growth.`,
        series: NET_MARGIN_SERIES,
        yAxisFormat: "percent",
        headerValue: `${(current.netMargin * 100).toFixed(1)}%`,
        headerDelta: `${((prior.netMargin - current.netMargin) * 100).toFixed(1)}pp`,
        headerDeltaDirection: "down",
        proofLabel: "Net Margin Calculation",
        mathSteps: [
          {
            left: { value: compactCurrency(current.operatingProfit), label: "Op. Profit" },
            operator: "minus",
            right: { value: compactCurrency(current.otherExpenses), label: "Other Exp." },
            result: { value: compactCurrency(current.netIncome), label: "Net Income" },
          },
          {
            left: { value: compactCurrency(current.netIncome), label: "Net Income" },
            operator: "divided by",
            right: { value: compactCurrency(current.revenue), label: "Revenue" },
            result: { value: `${(current.netMargin * 100).toFixed(1)}%`, label: "Margin" },
          },
        ],
        actions: [
          { label: "Review Tax Strategy", variant: "outline" },
          { label: "Cut Non-Essential Spend", variant: "primary" },
        ],
      }
    case "revenue-trend":
      return {
        title: "Revenue Trend",
        alertType: "success",
        alertMessage: `Revenue grew ${currencyFmt.format(current.revenue - first.revenue)} over 6 months (+${(((current.revenue - first.revenue) / first.revenue) * 100).toFixed(1)}%). Retainer base expanding steadily with 2.1% MoM growth in May.`,
        series: REVENUE_TREND_SERIES,
        yAxisFormat: "currency",
        headerValue: `${currencyFmt.format(current.revenue)}/mo`,
        headerDelta: `${(((current.revenue - first.revenue) / first.revenue) * 100).toFixed(1)}%`,
        headerDeltaDirection: "up",
        proofLabel: "Revenue Composition",
        mathSteps: [
          {
            left: { value: "$45.0K", label: "Retainers" },
            operator: "plus",
            right: { value: "$10.0K", label: "Projects" },
            result: { value: compactCurrency(current.revenue), label: "Total Rev." },
          },
        ],
        actions: [],
      }
    case "cogs-trend":
      return {
        title: "Direct Costs (COGS) Trend",
        alertType: "warning",
        alertMessage: `COGS grew +${(((current.cogs - first.cogs) / first.cogs) * 100).toFixed(1)}% over 6 months while revenue grew +${(((current.revenue - first.revenue) / first.revenue) * 100).toFixed(1)}%. Cost growth outpacing revenue is compressing gross margin.`,
        series: COGS_TREND_SERIES,
        yAxisFormat: "currency",
        headerValue: currencyFmt.format(current.cogs),
        headerDelta: `${(((current.cogs - prior.cogs) / prior.cogs) * 100).toFixed(1)}%`,
        headerDeltaDirection: "up",
        proofLabel: "COGS Breakdown",
        mathSteps: [
          {
            left: { value: "$15.5K", label: "Freelancers" },
            operator: "plus",
            right: { value: "$7.2K", label: "Hosting" },
            result: { value: "$22.7K", label: "Subtotal" },
          },
          {
            left: { value: "$22.7K", label: "Subtotal" },
            operator: "plus",
            right: { value: "$4.7K", label: "Software" },
            result: { value: compactCurrency(current.cogs), label: "Total COGS" },
          },
        ],
        actions: [
          { label: "Review Hosting Contracts", variant: "outline" },
          { label: "Audit Vendor Costs", variant: "primary" },
        ],
      }
    case "gross-profit-trend":
    default:
      return {
        title: "Gross Profit Trend",
        alertType: "warning",
        alertMessage: `Gross profit is flat despite revenue growth (+${currencyFmt.format(current.revenue - first.revenue)}). All incremental revenue absorbed by rising direct costs — margin compression from 52.5% to 50.1%.`,
        series: GROSS_PROFIT_SERIES,
        yAxisFormat: "currency",
        headerValue: currencyFmt.format(current.grossProfit),
        headerDelta: `${((first.grossMargin - current.grossMargin) * 100).toFixed(1)}pp`,
        headerDeltaDirection: "down",
        proofLabel: "Gross Profit Calculation",
        mathSteps: [
          {
            left: { value: compactCurrency(current.revenue), label: "Revenue" },
            operator: "minus",
            right: { value: compactCurrency(current.cogs), label: "COGS" },
            result: { value: compactCurrency(current.grossProfit), label: "Gross Profit" },
          },
        ],
        actions: [
          { label: "Review Pricing Strategy", variant: "outline" },
          { label: "Reduce Direct Costs", variant: "primary" },
        ],
      }
  }
}

function MathEquation({ steps, label }: { steps: MathStep[]; label: string }) {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {label}
      </h3>
      <div className="rounded-xl border border-border/40 bg-zinc-100/60 dark:bg-black/40 px-5 py-4">
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col">
              {i > 0 && <hr className="border-border/40 my-4" />}
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">{step.left.label}</div>
                  <div className="text-lg font-medium font-mono tabular-nums">{step.left.value}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {step.operator === "plus" ? "+" : step.operator === "minus" ? "−" : "÷"}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">{step.right.label}</div>
                  <div className="text-lg font-medium font-mono tabular-nums">{step.right.value}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
                  <span className="text-xs text-muted-foreground">=</span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">{step.result.label}</div>
                  <div className="text-lg font-medium font-mono tabular-nums text-brand-500">{step.result.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VarianceLedger({ data, spec }: { data: ProfitabilityTrendPoint[]; spec: DrawerSpec }) {
  const dataKey = spec.series[0].dataKey as keyof ProfitabilityTrendPoint
  const isPercent = spec.yAxisFormat === "percent"

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Period Comparison
      </h3>
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-16">Month</th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">
              {isPercent ? "Margin %" : "Amount"}
            </th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-24">
              MoM Δ
            </th>
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((point, i) => {
            const originalIndex = data.length - 1 - i
            const value = point[dataKey] as number
            const isFirst = i === 0
            const prevValue = originalIndex > 0 ? (data[originalIndex - 1][dataKey] as number) : null

            let delta: string
            let deltaColor: string
            if (prevValue === null) {
              delta = "—"
              deltaColor = "text-muted-foreground"
            } else if (isPercent) {
              const diff = (value - prevValue) * 100
              delta = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}pp`
              deltaColor = diff > 0 ? "text-emerald-600 dark:text-emerald-400" : diff < 0 ? "text-destructive" : "text-muted-foreground"
            } else {
              const diff = value - prevValue
              delta = `${diff >= 0 ? "+" : ""}$${(Math.abs(diff) / 1000).toFixed(1)}K`
              if (diff < 0) delta = `-$${(Math.abs(diff) / 1000).toFixed(1)}K`
              deltaColor = diff > 0 ? "text-emerald-600 dark:text-emerald-400" : diff < 0 ? "text-destructive" : "text-muted-foreground"
            }

            const formattedValue = isPercent
              ? `${(value * 100).toFixed(1)}%`
              : `$${(value / 1000).toFixed(1)}K`

            return (
              <tr
                key={point.month}
                className={`border-b border-border/30 last:border-0 ${isFirst ? "bg-accent/30" : ""}`}
              >
                <td className={`py-2 font-mono tabular-nums ${isFirst ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {point.month}
                </td>
                <td className={`py-2 text-right font-mono tabular-nums ${isFirst ? "font-bold text-foreground" : ""}`}>
                  {formattedValue}
                </td>
                <td className={`py-2 text-right font-mono tabular-nums ${deltaColor} ${isFirst ? "font-bold" : ""}`}>
                  {delta}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ProfitabilityTrendDrawerContent({ drawerId }: { drawerId: string }) {
  const spec = getDrawerSpec(drawerId)
  const isWarning = spec.alertType === "warning"

  return (
    <div className="flex flex-col h-full">
      {/* Header with metric lockup */}
      <div className="px-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold tracking-tight">
            {spec.title}
          </SheetTitle>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums">
              {spec.headerValue}
            </span>
            <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
              spec.headerDeltaDirection === "down"
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}>
              {spec.headerDeltaDirection === "down"
                ? <ArrowDown className="w-3 h-3" />
                : <ArrowUp className="w-3 h-3" />}
              {spec.headerDelta}
            </span>
          </div>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Insight banner */}
        <div className={`w-full border rounded-lg flex items-start gap-3 p-3 mb-6 ${
          isWarning
            ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
            : "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10"
        }`}>
          {isWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
          ) : (
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
          )}
          <span className={`text-sm font-medium ${
            isWarning
              ? "text-amber-800 dark:text-amber-400"
              : "text-emerald-800 dark:text-emerald-400"
          }`}>
            {spec.alertMessage}
          </span>
        </div>

        {/* Hero chart */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Trailing 6 Months
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={trendData}
              series={spec.series}
              xAxisKey="month"
              yAxisFormat={spec.yAxisFormat}
              hideLegend
            />
          </div>
        </div>

        {/* Visual math equation */}
        <MathEquation steps={spec.mathSteps} label={spec.proofLabel} />

        {/* Variance ledger */}
        <VarianceLedger data={trendData} spec={spec} />
      </div>

    </div>
  )
}
