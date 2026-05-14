"use client"

import { useQueryState } from "nuqs"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, TrendingUp, ArrowDown, ArrowUp } from "lucide-react"
import { DrawerPeriodSelector } from "@/components/ui/custom/drawer-period-selector"
import { filterByPeriod, periodLabel, DEFAULT_PERIOD, computePeriodAverage } from "@/lib/period-utils"
import {
  FinancialChart,
  GROSS_MARGIN_SERIES,
  OP_MARGIN_SERIES,
  NET_MARGIN_SERIES,
  REVENUE_TREND_SERIES,
  COGS_TREND_SERIES,
  GROSS_PROFIT_SERIES,
  REV_PER_FTE_SERIES,
  type ChartSeries,
} from "@/components/ui/custom/financial-chart"
import { MathEquation, type MathStep } from "./math-equation"
import { VarianceLedger } from "./variance-ledger"
import type { ProfitabilityTrendPoint } from "@/lib/db/types"

export const PROFITABILITY_TREND_DRAWER_IDS = [
  "gross-margin-trend",
  "op-margin-trend",
  "net-margin-trend",
  "revenue-trend",
  "cogs-trend",
  "gross-profit-trend",
  "rev-per-fte-trend",
] as const

const trendData: ProfitabilityTrendPoint[] = [
  { month: "Dec", revenue: 48000, cogs: 22800, grossProfit: 25200, opex: 15200, operatingProfit: 10000, otherExpenses: 1430, netIncome: 8570, grossMargin: 0.525, opMargin: 0.208, netMargin: 0.179, revPerFte: 155000 },
  { month: "Jan", revenue: 49500, cogs: 23500, grossProfit: 26000, opex: 15600, operatingProfit: 10400, otherExpenses: 1430, netIncome: 8970, grossMargin: 0.525, opMargin: 0.210, netMargin: 0.181, revPerFte: 158200 },
  { month: "Feb", revenue: 51000, cogs: 24200, grossProfit: 26800, opex: 16000, operatingProfit: 10800, otherExpenses: 1430, netIncome: 9370, grossMargin: 0.525, opMargin: 0.212, netMargin: 0.184, revPerFte: 161000 },
  { month: "Mar", revenue: 52500, cogs: 25000, grossProfit: 27500, opex: 16400, operatingProfit: 11100, otherExpenses: 1430, netIncome: 9670, grossMargin: 0.524, opMargin: 0.211, netMargin: 0.184, revPerFte: 164300 },
  { month: "Apr", revenue: 53800, cogs: 26300, grossProfit: 27500, opex: 16200, operatingProfit: 11300, otherExpenses: 1430, netIncome: 9870, grossMargin: 0.511, opMargin: 0.210, netMargin: 0.183, revPerFte: 166800 },
  { month: "May", revenue: 55000, cogs: 27445, grossProfit: 27555, opex: 17105, operatingProfit: 10450, otherExpenses: 1430, netIncome: 9020, grossMargin: 0.501, opMargin: 0.190, netMargin: 0.164, revPerFte: 168500 },
]

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const compactCurrency = (v: number) => `$${(v / 1000).toFixed(1)}K`

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
    case "rev-per-fte-trend":
      return {
        title: "Revenue per FTE Trend",
        alertType: "success",
        alertMessage: `Revenue per FTE grew ${compactCurrency(current.revPerFte - first.revPerFte)} over 6 months (${compactCurrency(first.revPerFte)} → ${compactCurrency(current.revPerFte)}). Steady improvement driven by revenue growth outpacing headcount.`,
        series: REV_PER_FTE_SERIES,
        yAxisFormat: "currency",
        headerValue: currencyFmt.format(current.revPerFte),
        headerDelta: `+${compactCurrency(current.revPerFte - prior.revPerFte)}`,
        headerDeltaDirection: "up",
        proofLabel: "Revenue per FTE Calculation",
        mathSteps: [
          {
            left: { value: compactCurrency(current.revenue), label: "Monthly Rev." },
            operator: "times",
            right: { value: "12", label: "Months" },
            result: { value: compactCurrency(current.revenue * 12), label: "Annualized" },
          },
          {
            left: { value: compactCurrency(current.revenue * 12), label: "Annual Rev." },
            operator: "divided by",
            right: { value: "3.92", label: "Avg FTEs" },
            result: { value: compactCurrency(current.revPerFte), label: "Rev/FTE" },
          },
        ],
        actions: [
          { label: "Review Headcount Plan", variant: "outline" },
          { label: "Optimize Utilization", variant: "primary" },
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

export function ProfitabilityTrendDrawerContent({ drawerId }: { drawerId: string }) {
  const [period, setPeriod] = useQueryState("period", { defaultValue: DEFAULT_PERIOD })
  const filteredData = filterByPeriod(trendData, period)
  const spec = getDrawerSpec(drawerId)
  const periodAverage = computePeriodAverage(filteredData, spec.series[0].dataKey, spec.yAxisFormat)
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
                : "bg-success/10 text-success"
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
            ? "border-warning/20 bg-warning/5 dark:bg-warning/10"
            : "border-success/20 bg-success/5 dark:bg-success/10"
        }`}>
          {isWarning ? (
            <AlertTriangle className="w-4 h-4 text-warning dark:text-warning mt-0.5 shrink-0" />
          ) : (
            <TrendingUp className="w-4 h-4 text-success mt-0.5 shrink-0" />
          )}
          <span className={`text-sm font-medium ${
            isWarning
              ? "text-warning"
              : "text-success"
          }`}>
            {spec.alertMessage}
          </span>
        </div>

        <DrawerPeriodSelector value={period} onValueChange={setPeriod} periodAverage={periodAverage} />

        {/* Hero chart */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {periodLabel(period)}
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={filteredData}
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
        <VarianceLedger data={filteredData} dataKey={spec.series[0].dataKey} format={spec.yAxisFormat} downIsGood={false} />
      </div>

    </div>
  )
}
