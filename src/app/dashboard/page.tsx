import { getDashboardMetrics, getAlerts, getTransactions } from "@/lib/db/services"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricsGrid } from "@/components/metrics-grid"
import { FinancialChart, REVENUE_EXPENSE_SERIES } from "@/components/ui/custom/financial-chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ChevronRight, RefreshCw, Flame, CheckCircle } from "lucide-react"
import Link from "next/link"
import { MonthSelector } from "@/components/month-selector"
import { mockChartData } from "@/lib/mock-data"
import { Badge, badgeVariants } from "@/components/ui/badge"

export default async function DashboardPage() {
  const [metrics, alerts, transactions] = await Promise.all([
    getDashboardMetrics(),
    getAlerts(),
    getTransactions()
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

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your agency&apos;s financial health.</p>
        </div>
        <MonthSelector />
      </div>

      {/* CoPilot Alert */}
      {criticalAlert && (
        <CoPilotAlert
          {...criticalAlert}
          message="Breaches 25% concentration ceiling."
          actions={
            <Link href="?drawer=u1" scroll={false}>
              <span className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors flex items-center gap-1 mt-3 sm:mt-0 cursor-pointer">
                Analyze Exposure <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          }
        />
      )}

      {/* Metric Anchors */}
      <MetricsGrid metrics={metrics.map((metric) => ({
        id: metric.id,
        title: metric.title,
        value: formatValue(metric.title, metric.value),
        target: formatTarget(metric.title, metric.target),
        trendText: metric.trendText,
        trendUp: metric.trendUp,
        trendDirection: metric.trendDirection,
        isHealthy: metric.isHealthy,
        drawerId: { ma_runway: "m1", ma_burn: "m2", ma_revenue: "m4", ma_margin: "m5" }[metric.id],
      }))} />

      {/* Split Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Cash vs Net Burn AreaChart */}
        <Card className="lg:col-span-2 p-6 border-border bg-card shadow-sm flex flex-col">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-lg font-medium text-foreground tracking-tight">Revenue vs. Expenses</h2>
            <p className="text-sm text-muted-foreground">Weekly revenue and expense trends over the trailing 90 days.</p>
          </div>
          <div className="h-[300px] w-full relative">
            <FinancialChart data={mockChartData} series={REVENUE_EXPENSE_SERIES} />
          </div>
        </Card>

        {/* Right Side: Worth Doing This Week */}
        <Card className="lg:col-span-1 flex flex-col border-border bg-card shadow-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-medium text-foreground">Worth Doing This Week</CardTitle>
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

      {/* Recent Scorecards Footer */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-foreground tracking-tight">Recent Scorecards</h2>
          <Button variant="ghost" size="sm">View Archive</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* April Card */}
          <Link href="/scorecards/april-2026">
            <Card className="border border-border bg-card shadow-sm p-6 hover:border-primary transition-colors cursor-pointer group h-full">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="font-bold text-lg">April 2026</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-0 text-[10px] tracking-wider uppercase font-semibold">Current</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-muted-foreground text-xs uppercase">Revenue</p>
                  <p className="font-semibold text-xl">
                    $41.5K
                    <span className="text-emerald-500 font-medium ml-2">&#8593; 9%</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-muted-foreground text-xs uppercase">Gross Margin</p>
                  <p className="font-semibold text-xl">
                    50.1%
                    <span className="text-emerald-500 font-medium ml-2">&#8593; 1.8 pts</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                View Report &#8594;
              </div>
            </Card>
          </Link>

          {/* March Card */}
          <Card className="border border-transparent bg-accent/20 dark:bg-white/[0.02] p-6 transition-all duration-300 cursor-pointer group h-full rounded-xl hover:border-border dark:hover:border-white/10 hover:bg-card hover:shadow-sm">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-300">March 2026</h3>
              <span className={badgeVariants({ variant: "outline" })}>ARCHIVED</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs uppercase">Revenue</p>
                <p className="font-semibold text-xl text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  $38.1K
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-emerald-600 dark:text-emerald-500 font-medium ml-2">&#8593; 4.4%</span>
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs uppercase">Gross Margin</p>
                <p className="font-semibold text-xl text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  48.3%
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-emerald-600 dark:text-emerald-500 font-medium ml-2">&#8593; 1.6 pts</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              View Report &#8594;
            </div>
          </Card>

          {/* February Card */}
          <Card className="border border-transparent bg-accent/20 dark:bg-white/[0.02] p-6 transition-all duration-300 cursor-pointer group h-full rounded-xl hover:border-border dark:hover:border-white/10 hover:bg-card hover:shadow-sm">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-300">February 2026</h3>
              <span className={badgeVariants({ variant: "outline" })}>ARCHIVED</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs uppercase">Revenue</p>
                <p className="font-semibold text-xl text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  $36.5K
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-emerald-600 dark:text-emerald-500 font-medium ml-2">&#8593; 3.2%</span>
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs uppercase">Gross Margin</p>
                <p className="font-semibold text-xl text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  46.7%
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-emerald-600 dark:text-emerald-500 font-medium ml-2">&#8593; 1.1 pts</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              View Report &#8594;
            </div>
          </Card>
        </div>
      </div>

    </div>
  )
}
