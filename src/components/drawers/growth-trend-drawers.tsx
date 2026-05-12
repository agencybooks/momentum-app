"use client"

import { useQueryState } from "nuqs"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, TrendingUp, ArrowDown, ArrowUp } from "lucide-react"
import { DrawerPeriodSelector } from "@/components/ui/custom/drawer-period-selector"
import { filterByPeriod, periodLabel, DEFAULT_PERIOD, computePeriodAverage } from "@/lib/period-utils"
import {
  FinancialChart,
  NRR_SERIES,
  BLENDED_CAC_SERIES,
  CAC_PAYBACK_SERIES,
  LTV_CAC_RATIO_SERIES,
  type ChartSeries,
} from "@/components/ui/custom/financial-chart"
import { MathEquation, type MathStep } from "./math-equation"
import { VarianceLedger } from "./variance-ledger"
import type { GrowthTrendPoint } from "@/lib/db/types"

export const GROWTH_TREND_DRAWER_IDS = [
  "nrr-trend",
  "blended-cac-trend",
  "cac-payback-trend",
  "ltv-cac-trend",
] as const

const growthTrendData: GrowthTrendPoint[] = [
  { month: "Dec", nrr: 1.10, blendedCac: 14800, cacPayback: 10.3, ltvCacRatio: 5.4 },
  { month: "Jan", nrr: 1.10, blendedCac: 14200, cacPayback: 9.8,  ltvCacRatio: 5.7 },
  { month: "Feb", nrr: 1.11, blendedCac: 13900, cacPayback: 9.4,  ltvCacRatio: 5.9 },
  { month: "Mar", nrr: 1.11, blendedCac: 13700, cacPayback: 9.1,  ltvCacRatio: 6.1 },
  { month: "Apr", nrr: 1.12, blendedCac: 13400, cacPayback: 8.8,  ltvCacRatio: 6.3 },
  { month: "May", nrr: 1.12, blendedCac: 13200, cacPayback: 8.5,  ltvCacRatio: 6.5 },
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
  yAxisFormat: "currency" | "percent" | "months" | "multiplier"
  headerValue: string
  headerDelta: string
  headerDeltaDirection: "down" | "up"
  proofLabel: string
  mathSteps: MathStep[]
  actions: DrawerAction[]
  downIsGood: boolean
}

function getDrawerSpec(drawerId: string): DrawerSpec {
  const current = growthTrendData[growthTrendData.length - 1]
  const first = growthTrendData[0]

  switch (drawerId) {
    case "nrr-trend":
      return {
        title: "Net Revenue Retention Trend",
        alertType: "success",
        alertMessage: `NRR expanded ${((current.nrr - first.nrr) * 100).toFixed(0)}pp over 6 months (${(first.nrr * 100).toFixed(0)}% → ${(current.nrr * 100).toFixed(0)}%). Expansion revenue from existing clients outpacing churn, indicating strong product-market fit and healthy upsell motion.`,
        series: NRR_SERIES,
        yAxisFormat: "percent",
        headerValue: `${(current.nrr * 100).toFixed(0)}%`,
        headerDelta: `+${((current.nrr - first.nrr) * 100).toFixed(1)}pp`,
        headerDeltaDirection: "up",
        proofLabel: "Net Revenue Retention Calculation",
        mathSteps: [
          {
            left: { value: "$38.0K", label: "Starting MRR" },
            operator: "plus",
            right: { value: "$12.0K", label: "Expansion" },
            result: { value: "$50.0K", label: "Subtotal" },
          },
          {
            left: { value: "$50.0K", label: "Subtotal" },
            operator: "minus",
            right: { value: "$7.4K", label: "Contraction + Churn" },
            result: { value: "$42.6K", label: "Ending MRR" },
          },
          {
            left: { value: "$42.6K", label: "Ending MRR" },
            operator: "divided by",
            right: { value: "$38.0K", label: "Starting MRR" },
            result: { value: "112%", label: "NRR" },
          },
        ],
        actions: [
          { label: "Review Expansion Pipeline", variant: "outline" },
          { label: "Analyze Churn Drivers", variant: "primary" },
        ],
        downIsGood: false,
      }
    case "blended-cac-trend":
      return {
        title: "Blended CAC Trend",
        alertType: "success",
        alertMessage: `Blended CAC declined ${compactCurrency(first.blendedCac - current.blendedCac)} over 6 months (${compactCurrency(first.blendedCac)} → ${compactCurrency(current.blendedCac)}). Improved targeting in paid channels and growing organic pipeline driving efficiency gains.`,
        series: BLENDED_CAC_SERIES,
        yAxisFormat: "currency",
        headerValue: currencyFmt.format(current.blendedCac),
        headerDelta: `-${compactCurrency(first.blendedCac - current.blendedCac)}`,
        headerDeltaDirection: "down",
        proofLabel: "Blended CAC Calculation",
        mathSteps: [
          {
            left: { value: "$39.6K", label: "Total S&M Spend" },
            operator: "divided by",
            right: { value: "3", label: "New Customers" },
            result: { value: currencyFmt.format(current.blendedCac), label: "Blended CAC" },
          },
        ],
        actions: [
          { label: "Review Channel Mix", variant: "outline" },
          { label: "Audit Ad Spend", variant: "primary" },
        ],
        downIsGood: true,
      }
    case "cac-payback-trend":
      return {
        title: "CAC Payback Period Trend",
        alertType: "success",
        alertMessage: `CAC payback shortened ${(first.cacPayback - current.cacPayback).toFixed(1)} months over 6 months (${first.cacPayback} mo → ${current.cacPayback} mo). Declining CAC combined with stable gross margins accelerating time to breakeven on new client acquisition.`,
        series: CAC_PAYBACK_SERIES,
        yAxisFormat: "months",
        headerValue: `${current.cacPayback} mo`,
        headerDelta: `-${(first.cacPayback - current.cacPayback).toFixed(1)} mo`,
        headerDeltaDirection: "down",
        proofLabel: "CAC Payback Calculation",
        mathSteps: [
          {
            left: { value: currencyFmt.format(current.blendedCac), label: "Blended CAC" },
            operator: "divided by",
            right: { value: "$1,553", label: "ARPA × Gross Margin" },
            result: { value: `${current.cacPayback} mo`, label: "Payback Period" },
          },
        ],
        actions: [
          { label: "Optimize Onboarding", variant: "outline" },
          { label: "Review Pricing Tiers", variant: "primary" },
        ],
        downIsGood: true,
      }
    case "ltv-cac-trend":
    default:
      return {
        title: "LTV:CAC Ratio Trend",
        alertType: "success",
        alertMessage: `LTV:CAC expanded from ${first.ltvCacRatio.toFixed(1)}x to ${current.ltvCacRatio.toFixed(1)}x over 6 months. Improving retention and declining acquisition costs driving capital efficiency well above the 3.0x benchmark.`,
        series: LTV_CAC_RATIO_SERIES,
        yAxisFormat: "multiplier",
        headerValue: `${current.ltvCacRatio.toFixed(1)}x`,
        headerDelta: `+${(current.ltvCacRatio - first.ltvCacRatio).toFixed(1)}x`,
        headerDeltaDirection: "up",
        proofLabel: "LTV:CAC Calculation",
        mathSteps: [
          {
            left: { value: "$85,700", label: "Lifetime Value" },
            operator: "divided by",
            right: { value: currencyFmt.format(current.blendedCac), label: "Blended CAC" },
            result: { value: `${current.ltvCacRatio.toFixed(1)}x`, label: "LTV:CAC" },
          },
        ],
        actions: [
          { label: "Scale Ad Budget", variant: "outline" },
          { label: "Review Retention Programs", variant: "primary" },
        ],
        downIsGood: false,
      }
  }
}

export function GrowthTrendDrawerContent({ drawerId }: { drawerId: string }) {
  const [period, setPeriod] = useQueryState("period", { defaultValue: DEFAULT_PERIOD })
  const filteredData = filterByPeriod(growthTrendData, period)
  const spec = getDrawerSpec(drawerId)
  const periodAverage = computePeriodAverage(filteredData, spec.series[0].dataKey, spec.yAxisFormat)
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

        <DrawerPeriodSelector value={period} onValueChange={setPeriod} periodAverage={periodAverage} />

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

        <MathEquation steps={spec.mathSteps} label={spec.proofLabel} />

        <VarianceLedger data={filteredData} dataKey={spec.series[0].dataKey} format={spec.yAxisFormat} downIsGood={spec.downIsGood} />
      </div>
    </div>
  )
}
