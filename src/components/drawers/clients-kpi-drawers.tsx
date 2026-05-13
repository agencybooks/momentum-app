"use client"

import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, AlertTriangle, Info } from "lucide-react"
import { FinancialChart, type ChartSeries } from "@/components/ui/custom/financial-chart"
import { VarianceLedger } from "./variance-ledger"
import { clients } from "@/lib/db/mock-db"
import type { ClientMrrTrendPoint, ClientMarginTrendPoint } from "@/lib/db/types"

export const CLIENTS_KPI_DRAWER_IDS = [
  "clients-total-mrr",
  "clients-blended-margin",
  "clients-rev-concentration",
  "clients-profit-concentration",
] as const

const mrrTrendData: ClientMrrTrendPoint[] = [
  { month: "Dec", totalMrr: 36800 },
  { month: "Jan", totalMrr: 37500 },
  { month: "Feb", totalMrr: 38200 },
  { month: "Mar", totalMrr: 38400 },
  { month: "Apr", totalMrr: 39500 },
  { month: "May", totalMrr: 40000 },
]

const marginTrendData: ClientMarginTrendPoint[] = [
  { month: "Dec", blendedMargin: 0.508 },
  { month: "Jan", blendedMargin: 0.514 },
  { month: "Feb", blendedMargin: 0.520 },
  { month: "Mar", blendedMargin: 0.532 },
  { month: "Apr", blendedMargin: 0.540 },
  { month: "May", blendedMargin: 0.548 },
]

const MRR_SERIES: ChartSeries[] = [
  { dataKey: "totalMrr", label: "Total MRR", color: "var(--color-brand-500)", fillOpacity: 0.3 },
]

const MARGIN_SERIES: ChartSeries[] = [
  { dataKey: "blendedMargin", label: "Blended Margin", color: "#22c55e", fillOpacity: 0.2 },
]

const CONCENTRATION_CEILING = 20

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const compactCurrency = (v: number) => `$${(v / 1000).toFixed(1)}K`

function getActiveClientsByMrr() {
  return clients
    .filter(c => c.mrr > 0)
    .sort((a, b) => b.mrr - a.mrr)
}

function TotalMrrDrawer() {
  const current = mrrTrendData[mrrTrendData.length - 1].totalMrr
  const prior = mrrTrendData[mrrTrendData.length - 2].totalMrr
  const growthPct = ((current - prior) / prior) * 100

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle>Total Active MRR</SheetTitle>
          <SheetDescription>Trailing 6-month MRR trend across active clients</SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="w-full border rounded-lg flex items-start gap-3 p-3 mb-6 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
            MRR grew {growthPct > 0 ? "+" : ""}{growthPct.toFixed(1)}% month-over-month to {compactCurrency(current)}.
            6-month growth of {compactCurrency(current - mrrTrendData[0].totalMrr)} ({(((current - mrrTrendData[0].totalMrr) / mrrTrendData[0].totalMrr) * 100).toFixed(1)}%).
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            6-Month Trend
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={mrrTrendData}
              series={MRR_SERIES}
              xAxisKey="month"
              yAxisFormat="currency"
              hideLegend
            />
          </div>
        </div>

        <VarianceLedger data={mrrTrendData} dataKey="totalMrr" format="currency" downIsGood={false} />
      </div>
    </div>
  )
}

function BlendedMarginDrawer() {
  const current = marginTrendData[marginTrendData.length - 1].blendedMargin
  const target = 0.50
  const aboveTarget = current >= target
  const deltaPp = ((current - target) * 100).toFixed(1)

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle>Blended Gross Margin</SheetTitle>
          <SheetDescription>Revenue-weighted average margin across active clients</SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className={`w-full border rounded-lg flex items-start gap-3 p-3 mb-6 ${
          aboveTarget
            ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10"
            : "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
        }`}>
          {aboveTarget ? (
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
          )}
          <span className={`text-sm font-medium ${
            aboveTarget
              ? "text-emerald-800 dark:text-emerald-400"
              : "text-amber-800 dark:text-amber-400"
          }`}>
            Blended margin at {(current * 100).toFixed(1)}% — {aboveTarget ? "+" : ""}{deltaPp}pp {aboveTarget ? "above" : "below"} the 50% target.
            {aboveTarget
              ? " Healthy margin cushion across the client base."
              : " Revenue-weighted margins are compressing — review high-MRR client service costs."}
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            6-Month Trend
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={marginTrendData}
              series={MARGIN_SERIES}
              xAxisKey="month"
              yAxisFormat="percent"
              hideLegend
            />
          </div>
        </div>

        <VarianceLedger data={marginTrendData} dataKey="blendedMargin" format="percent" downIsGood={false} />
      </div>
    </div>
  )
}

function RevenueConcentrationDrawer() {
  const sorted = getActiveClientsByMrr()
  const totalMrr = sorted.reduce((sum, c) => sum + c.mrr, 0)
  const top5 = sorted.slice(0, 5)
  const topPct = totalMrr > 0 ? (sorted[0].mrr / totalMrr) * 100 : 0
  const isAboveCeiling = topPct > CONCENTRATION_CEILING

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle>Revenue Concentration</SheetTitle>
          <SheetDescription>Top 5 clients by share of total MRR</SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {isAboveCeiling && (
          <div className="w-full border rounded-lg flex items-start gap-3 p-3 mb-6 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
              {sorted[0].name} holds {topPct.toFixed(0)}% of total MRR — above the {CONCENTRATION_CEILING}% risk ceiling.
              Losing this client would cut {compactCurrency(sorted[0].mrr)} in monthly revenue.
            </span>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Top 5 by Revenue Share
          </h3>

          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-8">#</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">Client</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-20">MRR</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-16">Share</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 pl-3 w-28">vs Ceiling</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((client, i) => {
                const pct = totalMrr > 0 ? (client.mrr / totalMrr) * 100 : 0
                const barWidth = Math.min((pct / 40) * 100, 100)
                const overCeiling = pct > CONCENTRATION_CEILING

                return (
                  <tr
                    key={client.id}
                    className="border-b border-border/30 last:border-0 transition-colors hover:bg-accent/30"
                  >
                    <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 font-medium">{client.name}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{compactCurrency(client.mrr)}</td>
                    <td className={`py-2.5 text-right font-mono tabular-nums font-semibold ${
                      overCeiling ? "text-amber-600 dark:text-amber-400" : ""
                    }`}>
                      {pct.toFixed(0)}%
                    </td>
                    <td className="py-2.5 pl-3">
                      <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            overCeiling ? "bg-amber-500" : "bg-brand-500/60"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
            <div className="w-3 h-0.5 bg-destructive/60 rounded" />
            <span className="text-xs text-muted-foreground">
              Risk Ceiling: {CONCENTRATION_CEILING}% — no single client should exceed this share
            </span>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Formula:</span>{" "}
            (Client MRR / Total MRR) &times; 100. Top 5 clients represent{" "}
            <span className="font-mono tabular-nums font-semibold text-foreground">
              {top5.reduce((sum, c) => sum + (totalMrr > 0 ? (c.mrr / totalMrr) * 100 : 0), 0).toFixed(0)}%
            </span>{" "}
            of total revenue.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfitConcentrationDrawer() {
  const sorted = getActiveClientsByMrr()
  const totalMrr = sorted.reduce((sum, c) => sum + c.mrr, 0)
  const totalGP = sorted.reduce((sum, c) => sum + c.mrr * c.margin, 0)
  const top5 = sorted.slice(0, 5)

  const topClient = sorted[0]
  const topRevPct = totalMrr > 0 ? (topClient.mrr / totalMrr) * 100 : 0
  const topProfitPct = totalGP > 0 ? ((topClient.mrr * topClient.margin) / totalGP) * 100 : 0
  const deltaPp = topProfitPct - topRevPct

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle>Profit Concentration</SheetTitle>
          <SheetDescription>Revenue share vs Profit share — the CFO gap</SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="w-full border rounded-lg flex items-start gap-3 p-3 mb-6 border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
          <span className="text-sm font-medium text-sky-800 dark:text-sky-400">
            {topClient.name} holds {topRevPct.toFixed(0)}% of revenue {deltaPp >= 0 ? "and" : "but only"}{" "}
            {topProfitPct.toFixed(0)}% of gross profit — a{" "}
            <span className="font-mono tabular-nums font-bold">
              {deltaPp >= 0 ? "+" : ""}{deltaPp.toFixed(0)}pp
            </span>{" "}
            concentration gap.
            {deltaPp > 0
              ? " This client is more profitable than their revenue share suggests."
              : deltaPp < 0
              ? " This client is over-serviced relative to their contribution."
              : ""}
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Revenue vs Profit Share — Top 5 Clients
          </h3>

          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">Client</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-20">Rev %</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-20">Profit %</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-16">Delta</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((client) => {
                const revPct = totalMrr > 0 ? (client.mrr / totalMrr) * 100 : 0
                const gp = client.mrr * client.margin
                const profitPct = totalGP > 0 ? (gp / totalGP) * 100 : 0
                const delta = profitPct - revPct

                return (
                  <tr
                    key={client.id}
                    className="border-b border-border/30 last:border-0 transition-colors hover:bg-accent/30"
                  >
                    <td className="py-2.5 font-medium">{client.name}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{revPct.toFixed(1)}%</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{profitPct.toFixed(1)}%</td>
                    <td className={`py-2.5 text-right font-mono tabular-nums font-semibold ${
                      delta > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : delta < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}>
                      {delta >= 0 ? "+" : ""}{delta.toFixed(1)}pp
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="mt-4 pt-3 border-t border-border/50 flex gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              More profitable than revenue share
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
              Over-serviced
            </span>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Why this matters:</span>{" "}
            When a client&apos;s profit share diverges from their revenue share, it reveals hidden margin erosion or
            outsized profitability. A negative delta means you&apos;re spending more to service them than their
            revenue justifies — the &ldquo;CFO gap.&rdquo;
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Total MRR</div>
              <div className="font-mono font-bold tabular-nums">{compactCurrency(totalMrr)}</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Total Gross Profit</div>
              <div className="font-mono font-bold tabular-nums">{compactCurrency(totalGP)}</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Top Client GP</div>
              <div className="font-mono font-bold tabular-nums">{currencyFmt.format(topClient.mrr * topClient.margin)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientsKpiDrawerContent({ drawerId }: { drawerId: string }) {
  switch (drawerId) {
    case "clients-total-mrr":
      return <TotalMrrDrawer />
    case "clients-blended-margin":
      return <BlendedMarginDrawer />
    case "clients-rev-concentration":
      return <RevenueConcentrationDrawer />
    case "clients-profit-concentration":
      return <ProfitConcentrationDrawer />
    default:
      return null
  }
}
