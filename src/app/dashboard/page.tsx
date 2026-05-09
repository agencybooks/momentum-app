import { getDashboardMetrics, getAlerts, getFinancialTimeline } from "@/lib/db/services"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricAnchor } from "@/components/metric-anchor"
import { FinancialChart } from "@/components/ui/custom/financial-chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
  const [metrics, alerts, timelineData] = await Promise.all([
    getDashboardMetrics(),
    getAlerts(),
    getFinancialTimeline()
  ])

  // Find a critical alert to show in Top Row
  const criticalAlert = alerts.find(a => a.type === "critical")

  const formatValue = (title: string, value: number) => {
    if (title.includes("Runway")) {
      return `${value} mos`
    }
    if (title.includes("Margin")) {
      return `${(value * 100).toFixed(0)}%`
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of your agency's financial health.</p>
      </div>

      {/* Top Row: CoPilot Alert */}
      {criticalAlert && (
        <div className="w-full">
          <CoPilotAlert {...criticalAlert} />
        </div>
      )}

      {/* Second Row: Metric Anchors Grid (4-column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricAnchor
            key={metric.id}
            title={metric.title}
            value={formatValue(metric.title, metric.value)}
            target={formatValue(metric.title, metric.target)}
            trendText={metric.trendText}
            isHealthy={metric.isHealthy}
          />
        ))}
      </div>

      {/* Third Row: Financial Chart */}
      <Card className="p-6 border-border bg-card shadow-sm">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg font-medium text-foreground tracking-tight">Cash vs. Burn Trajectory</h2>
          <p className="text-sm text-muted-foreground">90-day historical analysis of liquidity and outflows.</p>
        </div>
        <FinancialChart data={timelineData} />
      </Card>

      {/* Bottom Row: 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Actionable Signals */}
        <Card className="flex flex-col border-border bg-card shadow-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-medium text-foreground">Actionable Signals</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground font-medium">Acme Co Renewal:</strong> 30 days until renewal. MRR is $13,200 (33% concentration). Prepare QBR.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span><strong className="text-foreground font-medium">AWS Spikes:</strong> Infrastructure spend up 40% vs prior month. Recommend deep dive on usage.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                <span><strong className="text-foreground font-medium">Payroll Cleared:</strong> $31k Gusto outflow completed successfully. Runway remains healthy.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Right Side: Recent Activity Ledger */}
        <Card className="flex flex-col border-border bg-card shadow-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-medium text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-[160px] items-center justify-center p-6 pt-0">
            <p className="text-muted-foreground">[ Ledger Placeholder ]</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
