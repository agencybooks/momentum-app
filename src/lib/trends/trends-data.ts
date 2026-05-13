import type { TrendMetric, TrendsTimelinePoint, MetricUnit } from "./types"
import type { ProfitabilityTrendPoint, CashTrendPoint, GrowthTrendPoint } from "@/lib/db/types"
import { clientMrrTrend } from "@/lib/db/mock-db"

const profitabilityTrend: ProfitabilityTrendPoint[] = [
  { month: "Dec", revenue: 48000, cogs: 22800, grossProfit: 25200, opex: 15200, operatingProfit: 10000, otherExpenses: 1430, netIncome: 8570, grossMargin: 0.525, opMargin: 0.208, netMargin: 0.179, revPerFte: 155000 },
  { month: "Jan", revenue: 49500, cogs: 23500, grossProfit: 26000, opex: 15600, operatingProfit: 10400, otherExpenses: 1430, netIncome: 8970, grossMargin: 0.525, opMargin: 0.210, netMargin: 0.181, revPerFte: 158200 },
  { month: "Feb", revenue: 51000, cogs: 24200, grossProfit: 26800, opex: 16000, operatingProfit: 10800, otherExpenses: 1430, netIncome: 9370, grossMargin: 0.525, opMargin: 0.212, netMargin: 0.184, revPerFte: 161000 },
  { month: "Mar", revenue: 52500, cogs: 25000, grossProfit: 27500, opex: 16400, operatingProfit: 11100, otherExpenses: 1430, netIncome: 9670, grossMargin: 0.524, opMargin: 0.211, netMargin: 0.184, revPerFte: 164300 },
  { month: "Apr", revenue: 53800, cogs: 26300, grossProfit: 27500, opex: 16200, operatingProfit: 11300, otherExpenses: 1430, netIncome: 9870, grossMargin: 0.511, opMargin: 0.210, netMargin: 0.183, revPerFte: 166800 },
  { month: "May", revenue: 55000, cogs: 27445, grossProfit: 27555, opex: 17105, operatingProfit: 10450, otherExpenses: 1430, netIncome: 9020, grossMargin: 0.501, opMargin: 0.190, netMargin: 0.164, revPerFte: 168500 },
]

const cashTrendData: CashTrendPoint[] = [
  { month: "Dec", totalCash: 250000, inflows: 52000, outflows: 57000, netBurn: 5000, runway: 12.2, dso: 35 },
  { month: "Jan", totalCash: 232000, inflows: 49000, outflows: 67000, netBurn: 18000, runway: 10.5, dso: 36 },
  { month: "Feb", totalCash: 210000, inflows: 48000, outflows: 70000, netBurn: 22000, runway: 8.8, dso: 37 },
  { month: "Mar", totalCash: 185000, inflows: 45000, outflows: 70000, netBurn: 25000, runway: 7.4, dso: 38 },
  { month: "Apr", totalCash: 148000, inflows: 43000, outflows: 80000, netBurn: 37000, runway: 6.1, dso: 39 },
  { month: "May", totalCash: 125000, inflows: 41500, outflows: 56700, netBurn: 15200, runway: 5.4, dso: 41 },
]

const growthTrendData: GrowthTrendPoint[] = [
  { month: "Dec", nrr: 1.10, blendedCac: 14800, cacPayback: 10.3, ltvCacRatio: 5.4 },
  { month: "Jan", nrr: 1.10, blendedCac: 14200, cacPayback: 9.8, ltvCacRatio: 5.7 },
  { month: "Feb", nrr: 1.11, blendedCac: 13900, cacPayback: 9.4, ltvCacRatio: 5.9 },
  { month: "Mar", nrr: 1.11, blendedCac: 13700, cacPayback: 9.1, ltvCacRatio: 6.1 },
  { month: "Apr", nrr: 1.12, blendedCac: 13400, cacPayback: 8.8, ltvCacRatio: 6.3 },
  { month: "May", nrr: 1.12, blendedCac: 13200, cacPayback: 8.5, ltvCacRatio: 6.5 },
]

export const TREND_METRICS: TrendMetric[] = [
  { id: "mrr", label: "MRR", unit: "$", group: "revenue", dataKey: "mrr", renderAs: "bar" },
  { id: "net-momentum", label: "Net Momentum", unit: "$", group: "revenue", dataKey: "netMomentum", renderAs: "bar" },
  { id: "nrr", label: "NRR", unit: "%", group: "revenue", dataKey: "nrr", renderAs: "line" },
  { id: "gross-margin", label: "Gross Margin", unit: "%", group: "profitability", dataKey: "grossMargin", renderAs: "line" },
  { id: "net-margin", label: "Net Margin", unit: "%", group: "profitability", dataKey: "netMargin", renderAs: "line" },
  { id: "labor-efficiency", label: "Labor Efficiency", unit: "ratio", group: "profitability", dataKey: "laborEfficiency", renderAs: "line" },
  { id: "cash-position", label: "Cash Position", unit: "$", group: "liquidity", dataKey: "cashPosition", renderAs: "bar" },
  { id: "dso", label: "DSO", unit: "days", group: "liquidity", dataKey: "dso", renderAs: "line" },
]

export const TREND_COLORS = [
  "var(--color-trend-1)",
  "var(--color-trend-2)",
  "var(--color-trend-3)",
] as const

export function buildTrendsTimeline(): TrendsTimelinePoint[] {
  const months = profitabilityTrend.map((p) => p.month)

  return months.map((month, i) => {
    const prof = profitabilityTrend[i]
    const cash = cashTrendData.find((c) => c.month === month)
    const growth = growthTrendData.find((g) => g.month === month)
    const mrr = clientMrrTrend.find((m) => m.month === month)

    const currentMrr = mrr?.totalMrr ?? 0
    const prevMrr = i > 0
      ? (clientMrrTrend.find((m) => m.month === months[i - 1])?.totalMrr ?? 0)
      : currentMrr

    return {
      month,
      mrr: currentMrr,
      netMomentum: currentMrr - prevMrr,
      nrr: growth?.nrr ?? 0,
      grossMargin: prof.grossMargin,
      netMargin: prof.netMargin,
      laborEfficiency: prof.revPerFte / 100000,
      cashPosition: cash?.totalCash ?? 0,
      dso: cash?.dso ?? 0,
    }
  })
}

export function formatMetricValue(value: number, unit: MetricUnit): string {
  switch (unit) {
    case "$":
      if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}K`
      return `$${value.toLocaleString()}`
    case "%":
      return `${(value * 100).toFixed(1)}%`
    case "ratio":
      return `${value.toFixed(2)}x`
    case "days":
      return `${value}d`
  }
}

export function formatAxisTick(value: number, unit: MetricUnit): string {
  switch (unit) {
    case "$":
      return `$${(value / 1000).toFixed(0)}k`
    case "%":
      return `${(value * 100).toFixed(0)}%`
    case "ratio":
      return `${value.toFixed(1)}x`
    case "days":
      return `${value}d`
  }
}

export function resolveAxes(selectedMetrics: TrendMetric[]): { left: MetricUnit | null; right: MetricUnit | null } {
  const units = [...new Set(selectedMetrics.map((m) => m.unit))]
  if (units.length <= 1) return { left: units[0] ?? null, right: null }
  const dollarIdx = units.indexOf("$")
  if (dollarIdx >= 0) {
    units.splice(dollarIdx, 1)
    return { left: "$", right: units[0] }
  }
  return { left: units[0], right: units[1] ?? null }
}
