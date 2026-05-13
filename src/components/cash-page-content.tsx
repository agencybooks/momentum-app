"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { useQueryState } from "nuqs"
import type { MetricAnchor as MetricAnchorType, Invoice, Alert, Client } from "@/lib/db/types"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricsGrid } from "@/components/metrics-grid"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CashForecastChart } from "@/components/cash-forecast-chart"
import { ActionAlertsCard } from "@/components/action-alerts-card"
import { PageHeader } from "@/components/page-header"
import { payables, cashActionAlerts } from "@/lib/mock-data"
import { AgingBucketsSummary } from "@/components/aging-buckets-summary"
import { PayableActionGroup } from "@/components/payable-action-group"
import { cn } from "@/lib/utils"

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

interface CashPageContentProps {
  cashData: MetricAnchorType[]
  openInvoices: Invoice[]
  alerts: Alert[]
  clients: Client[]
}

interface ClientInvoiceGroup {
  clientId: string
  clientName: string
  invoices: Invoice[]
  totalAmount: number
  hasOverdue: boolean
  maxDaysOverdue: number
}

function groupInvoicesByClient(invoices: Invoice[], clients: Client[]): ClientInvoiceGroup[] {
  const clientMap = new Map(clients.map(c => [c.id, c.name]))
  const groups = new Map<string, Invoice[]>()

  for (const inv of invoices) {
    const existing = groups.get(inv.clientId) || []
    existing.push(inv)
    groups.set(inv.clientId, existing)
  }

  return Array.from(groups.entries())
    .map(([clientId, invs]) => ({
      clientId,
      clientName: clientMap.get(clientId) || "Unknown Client",
      invoices: invs.sort((a, b) => b.daysOverdue - a.daysOverdue),
      totalAmount: invs.reduce((sum, i) => sum + i.amount, 0),
      hasOverdue: invs.some(i => i.status === "Overdue"),
      maxDaysOverdue: Math.max(...invs.map(i => i.daysOverdue)),
    }))
    .sort((a, b) => {
      if (a.hasOverdue !== b.hasOverdue) return a.hasOverdue ? -1 : 1
      return b.totalAmount - a.totalAmount
    })
}

const formatValue = (title: string, value: number) => {
  if (title.includes("Runway")) return `${value} mo`
  if (title.includes("DSO")) return `${value} Days`
  if (title.includes("Burn")) {
    const abs = Math.abs(value)
    return `-$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}/mo`
  }
  return currencyFmt.format(value)
}

const formatTarget = (title: string, target: number) => {
  if (title.includes("Runway")) return `> ${target}`
  if (title.includes("DSO")) return `< ${target}d`
  if (title.includes("Burn")) {
    const abs = Math.abs(target)
    return `-$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}/mo`
  }
  return currencyFmt.format(target)
}

const drawerIdMap: Record<string, string> = {
  ma_cash: "m9",
  ma_burn: "m2",
  ma_runway: "m1",
  ma_dso: "m3",
}

export function CashPageContent({ cashData, openInvoices, alerts, clients }: CashPageContentProps) {
  const [, setDrawer] = useQueryState("drawer")
  const [expandedAR, setExpandedAR] = useState<Set<string>>(new Set())
  const [expandedAP, setExpandedAP] = useState<Set<string>>(new Set())
  const [activeBucket, setActiveBucket] = useState<string | null>(null)
  const [activeAPBucket, setActiveAPBucket] = useState<string | null>(null)
  const [payableStates, setPayableStates] = useState<Record<string, "idle" | "paid" | "scheduled">>({})

  const criticalAlert = alerts.find(a => a.type === "critical" && a.drawerTrigger === "ar-intelligence") || alerts.find(a => a.type === "critical")
  const clientGroups = groupInvoicesByClient(openInvoices, clients)

  const totalOpenAR = openInvoices.reduce((sum, i) => sum + i.amount, 0)
  const overdueInvoices = openInvoices.filter(i => i.status === "Overdue")
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.amount, 0)
  const currentTotal = totalOpenAR - overdueTotal

  const agingBuckets = (() => {
    let current = 0
    let days1to30 = 0
    let days31to60 = 0
    let days60plus = 0
    for (const inv of openInvoices) {
      if (inv.daysOverdue === 0) current += inv.amount
      else if (inv.daysOverdue <= 30) days1to30 += inv.amount
      else if (inv.daysOverdue <= 60) days31to60 += inv.amount
      else days60plus += inv.amount
    }
    return [
      { label: "Current", amount: current },
      { label: "1-30 Days", amount: days1to30 },
      { label: "31-60 Days", amount: days31to60 },
      { label: "60+ Days", amount: days60plus },
    ]
  })()

  const handleBucketClick = (label: string) => {
    setActiveBucket(prev => prev === label ? null : label)
  }

  const handleAPBucketClick = (label: string) => {
    setActiveAPBucket(prev => prev === label ? null : label)
  }

  const apBuckets = (() => {
    let due7 = 0
    let days8to14 = 0
    let days15to30 = 0
    let days30plus = 0
    for (const p of payables) {
      if (p.daysUntilDue <= 7) due7 += p.amount
      else if (p.daysUntilDue <= 14) days8to14 += p.amount
      else if (p.daysUntilDue <= 30) days15to30 += p.amount
      else days30plus += p.amount
    }
    return [
      { label: "Due < 7 Days", amount: due7 },
      { label: "8-14 Days", amount: days8to14 },
      { label: "15-30 Days", amount: days15to30 },
      { label: "30+ Days", amount: days30plus },
    ]
  })()

  const apColorMap: Record<string, string> = {
    "Due < 7 Days": "bg-destructive",
    "8-14 Days": "bg-amber-500",
  }

  const handlePayableAction = (payableId: string, action: "paid" | "scheduled") => {
    setPayableStates(prev => ({
      ...prev,
      [payableId]: prev[payableId] === action ? "idle" : action,
    }))
  }

  const toggleAR = (clientId: string) => {
    setExpandedAR(prev => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })
  }

  const toggleAP = (vendorId: string) => {
    setExpandedAP(prev => {
      const next = new Set(prev)
      if (next.has(vendorId)) next.delete(vendorId)
      else next.add(vendorId)
      return next
    })
  }

  const totalOpenAP = payables.reduce((sum, p) => sum + p.amount, 0)
  const urgentAPTotal = payables.filter(p => p.daysUntilDue <= 7).reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Cash & Treasury"
        subtitle="Monitor your operational cash position, collections, and payables."
        actions={
          criticalAlert ? (
            <CoPilotAlert
              {...criticalAlert}
              actions={
                <Link href="?drawer=u2" scroll={false}>
                  <span className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors flex items-center gap-1 mt-3 sm:mt-0 cursor-pointer">
                    View Collections <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              }
            />
          ) : undefined
        }
      />

      <MetricsGrid
        columns={4}
        metrics={cashData.map((metric) => ({
          id: metric.id,
          title: metric.title,
          value: formatValue(metric.title, metric.value),
          target: formatTarget(metric.title, metric.target),
          trendText: metric.trendText,
          trendUp: metric.trendUp,
          trendDirection: metric.trendDirection,
          isHealthy: metric.isHealthy,
          drawerId: drawerIdMap[metric.id],
        }))}
      />

      {/* Stage 1: Projection (70%) + Action Alerts (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashForecastChart />
        </div>
        <div className="lg:col-span-1">
          <ActionAlertsCard alerts={cashActionAlerts} />
        </div>
      </div>

      {/* Stage 2: A/R Collections + A/P Outflows (50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <Card className="flex flex-col border-border bg-card h-full">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-medium text-foreground tracking-tight">Cash Inflows (A/R)</CardTitle>
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <span className="text-sm font-semibold text-foreground font-mono tabular-nums">
                  OPEN A/R: {currencyFmt.format(totalOpenAR)}
                </span>
                {overdueTotal > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    Overdue {currencyFmt.format(overdueTotal)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <div className="px-6 pb-2">
              <AgingBucketsSummary
                buckets={agingBuckets}
                totalOutstanding={totalOpenAR}
                activeBucket={activeBucket}
                onBucketClick={handleBucketClick}
              />
            </div>
            <CardContent className="flex-1 overflow-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[65%] text-sm font-medium text-muted-foreground border-b bg-transparent">Client</TableHead>
                    <TableHead className="w-[35%] text-sm font-medium text-muted-foreground border-b bg-transparent text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientGroups.map((group) => {
                    const isExpanded = expandedAR.has(group.clientId)
                    return (
                      <Fragment key={group.clientId}>
                        <TableRow
                          onClick={() => toggleAR(group.clientId)}
                          aria-expanded={isExpanded}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-muted/50",
                            isExpanded && "border-b-0 bg-muted/30"
                          )}
                        >
                          <TableCell className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <ChevronRight className={cn(
                                "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )} />
                              <span className="font-medium text-foreground truncate">{group.clientName}</span>
                              {group.hasOverdue && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">Overdue</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 px-3 text-right font-mono tabular-nums font-medium">
                            {currencyFmt.format(group.totalAmount)}
                          </TableCell>
                        </TableRow>
                        <tr className={isExpanded ? "border-b border-border" : ""}>
                          <td colSpan={2} className="p-0">
                            <div className="accordion-panel" data-open={isExpanded}>
                              <div>
                                <div className="bg-zinc-50/40 dark:bg-zinc-900/30 border-l-[3px] border-brand-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
                                  {group.invoices.map((invoice) => (
                                    <div
                                      key={invoice.id}
                                      className="group grid grid-cols-[65%_35%] items-center hover:bg-muted/50 transition-colors py-2 px-3 border-b border-border/30 last:border-0"
                                    >
                                      <div className="pl-5">
                                        <span className="font-medium text-sm text-foreground">{invoice.invoiceNumber}</span>
                                        {invoice.status === "Overdue" ? (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-destructive">{invoice.daysOverdue}d overdue</span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-5 text-[10px] px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                              onClick={(e) => { e.stopPropagation(); setDrawer("u2") }}
                                            >
                                              Analyze
                                            </Button>
                                          </div>
                                        ) : (
                                          <div className="text-xs text-muted-foreground">Open</div>
                                        )}
                                      </div>
                                      <div className="text-right font-mono tabular-nums text-sm font-medium">
                                        {currencyFmt.format(invoice.amount)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <Card className="flex flex-col border-border bg-card h-full">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-medium text-foreground tracking-tight">Cash Outflows (A/P)</CardTitle>
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <span className="text-sm font-semibold text-foreground font-mono tabular-nums">
                  OPEN A/P: {currencyFmt.format(totalOpenAP)}
                </span>
                {urgentAPTotal > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    Due &lt; 7d {currencyFmt.format(urgentAPTotal)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <div className="px-6 pb-2">
              <AgingBucketsSummary
                buckets={apBuckets}
                totalOutstanding={totalOpenAP}
                activeBucket={activeAPBucket}
                onBucketClick={handleAPBucketClick}
                colorMap={apColorMap}
              />
            </div>
            <CardContent className="flex-1 overflow-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[32%] text-sm font-medium text-muted-foreground border-b bg-transparent">Vendor / Category</TableHead>
                    <TableHead className="w-[20%] text-sm font-medium text-muted-foreground border-b bg-transparent">Due Date</TableHead>
                    <TableHead className="w-[20%] text-sm font-medium text-muted-foreground border-b bg-transparent text-right">Amount</TableHead>
                    <TableHead className="w-[28%] text-sm font-medium text-muted-foreground border-b bg-transparent text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payables.map((p) => {
                    const isExpanded = expandedAP.has(p.id)
                    return (
                      <Fragment key={p.id}>
                        <TableRow
                          onClick={() => toggleAP(p.id)}
                          aria-expanded={isExpanded}
                          className={cn(
                            "group cursor-pointer transition-colors hover:bg-muted/50",
                            isExpanded && "border-b-0 bg-muted/30"
                          )}
                        >
                          <TableCell className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <ChevronRight className={cn(
                                "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )} />
                              <span className="font-medium text-foreground">{p.vendor}</span>
                              {!p.canDelay && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-destructive border-destructive/30">Fixed</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 px-4 text-muted-foreground">{p.dueDate}</TableCell>
                          <TableCell className="py-2.5 px-4 text-right font-mono tabular-nums font-medium">
                            {currencyFmt.format(p.amount)}
                          </TableCell>
                          <TableCell className="py-2.5 px-4 text-right">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <PayableActionGroup
                                canDelay={p.canDelay}
                                status={payableStates[p.id] || "idle"}
                                onPay={() => handlePayableAction(p.id, "paid")}
                                onSchedule={() => handlePayableAction(p.id, "scheduled")}
                                onDelay={() => setDrawer("u3")}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        <tr className={isExpanded ? "border-b border-border" : ""}>
                          <td colSpan={4} className="p-0">
                            <div className="accordion-panel" data-open={isExpanded}>
                              <div>
                                <div className="bg-zinc-50/40 dark:bg-zinc-900/30 border-l-[3px] border-brand-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
                                  <div className="grid grid-cols-[32%_20%_20%_28%] items-center hover:bg-muted/50 transition-colors py-2.5 px-4">
                                    <div className="pl-6">
                                      <span className="text-sm text-muted-foreground">
                                        {p.canDelay ? "Deferral available" : "Non-negotiable — payroll or infrastructure"}
                                      </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Due {p.dueDate}</div>
                                    <div className="text-right font-mono tabular-nums text-sm font-medium">
                                      {currencyFmt.format(p.amount)}
                                    </div>
                                    <div className="text-right">
                                      <PayableActionGroup
                                        canDelay={p.canDelay}
                                        status={payableStates[p.id] || "idle"}
                                        onPay={() => handlePayableAction(p.id, "paid")}
                                        onSchedule={() => handlePayableAction(p.id, "scheduled")}
                                        onDelay={() => setDrawer("u3")}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
