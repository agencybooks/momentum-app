"use client"

import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, TrendingUp, ArrowDown, ArrowUp } from "lucide-react"
import {
  FinancialChart,
  TOTAL_CASH_SERIES,
  NET_BURN_TREND_SERIES,
  RUNWAY_SERIES,
  DSO_SERIES,
  type ChartSeries,
} from "@/components/ui/custom/financial-chart"
import { MathEquation, type MathStep } from "./math-equation"
import { VarianceLedger } from "./variance-ledger"
import type { CashTrendPoint } from "@/lib/db/types"

export const CASH_TREND_DRAWER_IDS = ["m9", "m2", "m1", "m3"] as const

const cashTrendData: CashTrendPoint[] = [
  { month: "Dec", totalCash: 250000, inflows: 52000, outflows: 57000, netBurn: 5000,  runway: 12.2, dso: 35 },
  { month: "Jan", totalCash: 232000, inflows: 49000, outflows: 67000, netBurn: 18000, runway: 10.5, dso: 36 },
  { month: "Feb", totalCash: 210000, inflows: 48000, outflows: 70000, netBurn: 22000, runway: 8.8,  dso: 37 },
  { month: "Mar", totalCash: 185000, inflows: 45000, outflows: 70000, netBurn: 25000, runway: 7.4,  dso: 38 },
  { month: "Apr", totalCash: 148000, inflows: 43000, outflows: 80000, netBurn: 37000, runway: 6.1,  dso: 39 },
  { month: "May", totalCash: 125000, inflows: 41500, outflows: 56700, netBurn: 15200, runway: 5.4,  dso: 41 },
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
  yAxisFormat: "currency" | "percent" | "months" | "multiplier" | "days"
  headerValue: string
  headerDelta: string
  headerDeltaDirection: "down" | "up"
  proofLabel: string
  mathSteps: MathStep[]
  actions: DrawerAction[]
  downIsGood: boolean
}

function getDrawerSpec(drawerId: string): DrawerSpec {
  const current = cashTrendData[cashTrendData.length - 1]
  const first = cashTrendData[0]

  switch (drawerId) {
    case "m9":
      return {
        title: "Total Cash Position",
        alertType: "warning",
        alertMessage: `Cash declined ${compactCurrency(first.totalCash - current.totalCash)} over 6 months (${compactCurrency(first.totalCash)} → ${compactCurrency(current.totalCash)}). Current position is $75K below the $200K operating target. At current burn rate (${compactCurrency(current.netBurn)}/mo), ${current.runway} months of runway remaining.`,
        series: TOTAL_CASH_SERIES,
        yAxisFormat: "currency",
        headerValue: currencyFmt.format(current.totalCash),
        headerDelta: `-${compactCurrency(first.totalCash - current.totalCash)}`,
        headerDeltaDirection: "down",
        proofLabel: "Net Cash Position",
        mathSteps: [
          {
            left: { value: currencyFmt.format(current.totalCash), label: "Cash On Hand" },
            operator: "minus",
            right: { value: "$42,500", label: "Payables (14d)" },
            result: { value: "$82,500", label: "Subtotal" },
          },
          {
            left: { value: "$82,500", label: "Subtotal" },
            operator: "plus",
            right: { value: "$29,300", label: "Expected A/R" },
            result: { value: "$111,800", label: "Net Position" },
          },
        ],
        actions: [
          { label: "View Transaction Ledger", variant: "outline" },
          { label: "Review Cash Forecast", variant: "primary" },
        ],
        downIsGood: false,
      }
    case "m2":
      return {
        title: "Net Burn Trend",
        alertType: "warning",
        alertMessage: `Net burn accelerated from ${compactCurrency(first.netBurn)}/mo to ${compactCurrency(current.netBurn)}/mo over 6 months. Driven by $25K miss in A/R collections and rising operational costs. April spike to ${compactCurrency(cashTrendData[4].netBurn)} driven by delayed receivables.`,
        series: NET_BURN_TREND_SERIES,
        yAxisFormat: "currency",
        headerValue: `${compactCurrency(current.netBurn)}/mo`,
        headerDelta: `+${compactCurrency(current.netBurn - first.netBurn)}`,
        headerDeltaDirection: "up",
        proofLabel: "Net Burn Calculation (May)",
        mathSteps: [
          {
            left: { value: currencyFmt.format(current.inflows), label: "Cash Inflows" },
            operator: "minus",
            right: { value: currencyFmt.format(current.outflows), label: "Cash Outflows" },
            result: { value: `-${compactCurrency(current.netBurn)}`, label: "Net Burn" },
          },
        ],
        actions: [
          { label: "Review A/R Collections", variant: "outline" },
          { label: "Audit Outflows", variant: "primary" },
        ],
        downIsGood: true,
      }
    case "m1":
      return {
        title: "Cash Runway Trend",
        alertType: "warning",
        alertMessage: `Runway tightened ${(first.runway - current.runway).toFixed(1)} months over 6 months (${first.runway} mo → ${current.runway} mo). Driven by $15K increase in marketing spend and $25K delayed A/R. Zero-cash date estimated late Oct 2026.`,
        series: RUNWAY_SERIES,
        yAxisFormat: "months",
        headerValue: `${current.runway} mo`,
        headerDelta: `-${(first.runway - current.runway).toFixed(1)} mo`,
        headerDeltaDirection: "down",
        proofLabel: "Runway Calculation",
        mathSteps: [
          {
            left: { value: "$222,800", label: "Operating Cash" },
            operator: "divided by",
            right: { value: "$41,200/mo", label: "Avg Net Burn" },
            result: { value: `${current.runway} mo`, label: "Runway" },
          },
        ],
        actions: [
          { label: "Collect Overdue A/R", variant: "outline" },
          { label: "Model Runway Scenarios", variant: "primary" },
        ],
        downIsGood: false,
      }
    case "m3":
    default:
      return {
        title: "Days Sales Outstanding Trend",
        alertType: "warning",
        alertMessage: `DSO increased ${current.dso - first.dso} days over 6 months (${first.dso}d → ${current.dso}d). Cash conversion efficiency is declining. Collections are slowing — Cobalt Outdoor 75d overdue is the primary driver.`,
        series: DSO_SERIES,
        yAxisFormat: "days",
        headerValue: `${current.dso} days`,
        headerDelta: `+${current.dso - first.dso} d`,
        headerDeltaDirection: "up",
        proofLabel: "DSO Calculation",
        mathSteps: [
          {
            left: { value: "$112,000", label: "Total Open A/R" },
            operator: "divided by",
            right: { value: "$1,000,000", label: "Annual Revenue" },
            result: { value: "0.112", label: "A/R Ratio" },
          },
          {
            left: { value: "0.112", label: "A/R Ratio" },
            operator: "times",
            right: { value: "365", label: "Days" },
            result: { value: `${current.dso} days`, label: "DSO" },
          },
        ],
        actions: [
          { label: "Enforce Net-30 Terms", variant: "outline" },
          { label: "Automate Follow-ups", variant: "primary" },
        ],
        downIsGood: true,
      }
  }
}

export function CashTrendDrawerContent({ drawerId }: { drawerId: string }) {
  const spec = getDrawerSpec(drawerId)
  const isWarning = spec.alertType === "warning"
  const deltaIsGood = spec.downIsGood
    ? spec.headerDeltaDirection === "down"
    : spec.headerDeltaDirection === "up"

  return (
    <div className="flex flex-col h-full">
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
              deltaIsGood
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
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

      <div className="flex-1 overflow-y-auto px-4 pb-6">
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

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Trailing 6 Months
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={cashTrendData}
              series={spec.series}
              xAxisKey="month"
              yAxisFormat={spec.yAxisFormat}
              hideLegend
            />
          </div>
        </div>

        <MathEquation steps={spec.mathSteps} label={spec.proofLabel} />

        <VarianceLedger data={cashTrendData} dataKey={spec.series[0].dataKey} format={spec.yAxisFormat} downIsGood={spec.downIsGood} />
      </div>
    </div>
  )
}
