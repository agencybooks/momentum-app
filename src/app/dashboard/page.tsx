import { Suspense } from "react"
import { getDashboardMetrics, getAlerts, getTransactions, getOpenInvoices, getClients, getARAgingSummary, getRecentScorecards } from "@/lib/db/services"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricsGrid } from "@/components/metrics-grid"
import { RecentScorecardsList } from "@/components/recent-scorecards-list"
import { OpenInvoicesWidget } from "@/components/open-invoices-widget"
import { FinancialChart, REVENUE_EXPENSE_SERIES } from "@/components/ui/custom/financial-chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ChevronRight, RefreshCw, Flame, CheckCircle } from "lucide-react"
import Link from "next/link"
import { mockChartData } from "@/lib/mock-data"
import { PageHeader } from "@/components/page-header"

export default async function DashboardPage() {
  const [metrics, alerts, transactions, openInvoices, allClients, agingSummary, scorecards] = await Promise.all([
    getDashboardMetrics(),
    getAlerts(),
    getTransactions(),
    getOpenInvoices(),
    getClients(),
    getARAgingSummary(),
    getRecentScorecards(),
  ])

  const criticalAlert = alerts.find(a => a.type === "critical")

  const formatValue = (title: string, value: number) => {
    if (title.includes("Runway")) return `${value} mos`
    if (title.includes("Margin")) return `${(value * 100).toFixed(1)}%`
    if (title.includes("Burn")) {
      const abs = Math.abs(value)
      return `-$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}/mo`
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  }

  const formatTarget = (title: string, target: number) => {
    if (title.includes("Runway")) return `${target} mos`
    if (title.includes("Margin")) return `${(target * 100).toFixed(0)}%`
    if (title.includes("Burn")) {
      const abs = Math.abs(target)
      return `-$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}/mo`
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(target)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
          title="Mission Control"
          subtitle="Real-time overview of your agency's financial health."
          actions={
            criticalAlert ? (
              <CoPilotAlert
                {...criticalAlert}
                message="Breaches 25% concentration ceiling."
                actions={
                  <Link href="?drawer=u1" scroll={false}>
                    <span className="text-sm font-medium text-foreground hover:opacity-70 transition-all duration-200 flex items-center whitespace-nowrap cursor-pointer">
                      Analyze Exposure <ArrowUpRight className="h-3 w-3 ml-1" />
                    </span>
                  </Link>
                }
              />
            ) : undefined
          }
        />

        <Suspense>
          <MetricsGrid columns={5} metrics={metrics.map((metric) => ({
            id: metric.id,
            title: metric.title,
            value: formatValue(metric.title, metric.value),
            target: formatTarget(metric.title, metric.target),
            trendText: metric.trendText,
            trendUp: metric.trendUp,
            trendDirection: metric.trendDirection,
            isHealthy: metric.isHealthy,
            drawerId: { ma_cash: "m9", ma_runway: "m1", ma_burn: "m2", ma_mrr: "m4", ma_margin: "m5" }[metric.id],
          }))} />
        </Suspense>

      {/* Deep Dive Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Cash vs Net Burn AreaChart */}
        <Card className="lg:col-span-2 p-6 border-border bg-card shadow-sm flex flex-col">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-lg font-medium text-foreground tracking-tight">Revenue vs. Expenses</h2>
            <p className="text-sm text-muted-foreground">Monthly revenue and expense trends over the trailing six months.</p>
          </div>
          <div className="h-[300px] w-full relative">
            <FinancialChart data={mockChartData} series={REVENUE_EXPENSE_SERIES} />
          </div>
        </Card>

        {/* Right Side: Worth Doing This Week */}
        <Card className="lg:col-span-1 flex flex-col border-border bg-card shadow-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-medium text-foreground tracking-tight">Worth Doing This Week</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="flex flex-col">
              <Link
                href="?drawer=action-insight&clientId=cl_01"
                scroll={false}
                className="flex items-start gap-3 px-6 py-4 border-b border-border/40 hover:bg-accent/50 transition-colors group"
              >
                <RefreshCw className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Acme Co Renewal</p>
                  <p className="text-xs text-muted-foreground truncate">30 days until renewal. MRR $13,200 (33% concentration).</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/profitability?drawer=u4"
                scroll={false}
                className="flex items-start gap-3 px-6 py-4 border-b border-border/40 hover:bg-accent/50 transition-colors group"
              >
                <Flame className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">AWS Spikes</p>
                  <p className="text-xs text-muted-foreground truncate">Infrastructure spend up 40% vs prior month.</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/cash"
                scroll={false}
                className="flex items-start gap-3 px-6 py-4 hover:bg-accent/50 transition-colors group"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-success mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Payroll Cleared</p>
                  <p className="text-xs text-muted-foreground truncate">$31k Gusto outflow completed. Runway healthy.</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Split: Scorecards + A/R */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:grid-rows-[440px]">
        <RecentScorecardsList scorecards={scorecards} />
        <OpenInvoicesWidget
          agingSummary={agingSummary}
          openInvoices={openInvoices}
          clients={allClients}
        />
      </div>

    </div>
  )
}
