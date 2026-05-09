import { getCashData, getOverdueInvoices, getAlerts, getFinancialTimeline } from "@/lib/db/services"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricAnchor } from "@/components/metric-anchor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FinancialChart } from "@/components/ui/custom/financial-chart"

export default async function CashPage() {
  const [cashData, overdueInvoices, alerts, timelineData] = await Promise.all([
    getCashData(),
    getOverdueInvoices(),
    getAlerts(),
    getFinancialTimeline()
  ])

  // Find a critical alert to show in Zone 1. We specifically look for the Cobalt Outdoor one if possible, or any critical alert.
  const criticalAlert = alerts.find(a => a.type === "critical" && a.drawerTrigger === "ar-intelligence") || alerts.find(a => a.type === "critical")

  const formatValue = (title: string, value: number) => {
    if (title.includes("Runway")) {
      return `${value} mos`
    }
    if (title.includes("Cash") || title.includes("A/R") || title.includes("Operating Cash")) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    }
    return value.toString()
  }

  const formatTarget = (title: string, target: number) => {
    if (title.includes("Runway")) {
      return `${target} mos`
    }
    if (title.includes("Cash") || title.includes("A/R") || title.includes("Operating Cash")) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(target)
    }
    return target.toString()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Cash Flow & Liquidity</h1>
        <p className="text-muted-foreground mt-1">Monitor your operational cash position and accounts receivable.</p>
      </div>

      {/* Zone 1: CoPilot Alert */}
      {criticalAlert && (
        <div className="w-full">
          <CoPilotAlert {...criticalAlert} />
        </div>
      )}

      {/* Zone 2: Metric Anchors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cashData.map((metric) => (
          <MetricAnchor
            key={metric.id}
            title={metric.title}
            value={formatValue(metric.title, metric.value)}
            target={formatTarget(metric.title, metric.target)}
            trendText={metric.trendText}
            isHealthy={metric.isHealthy}
          />
        ))}
      </div>

      {/* Zone 3: Financial Narrative Chart */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-lg font-medium text-foreground mb-4">Cash vs Burn (90 Days)</h2>
        <FinancialChart data={timelineData} />
      </Card>

      {/* Zone 4 & 5: A/R and A/P Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Zone 4: A/R Collections */}
        <Card className="flex flex-col border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">A/R Collections</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Invoice</TableHead>
                  <TableHead className="text-muted-foreground">Due</TableHead>
                  <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-right text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueInvoices.length > 0 ? (
                  overdueInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {invoice.invoiceNumber}
                        <div className="text-xs text-destructive">{invoice.daysOverdue} days overdue</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(invoice.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`?drawer=ar-intelligence&clientId=${invoice.clientId}`} scroll={false}>
                          <Button variant="outline" size="sm" className="h-8">
                            Analyze ↗
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No overdue invoices.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Zone 5: A/P Payables Placeholder */}
        <Card className="flex flex-col border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">A/P Payables</CardTitle>
          </CardHeader>
          <CardContent className="flex h-full min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">[ Upcoming Payables Placeholder ]</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
