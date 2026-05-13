"use client"

import * as React from "react"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { CheckCircle } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { formatCurrencyFull } from "@/lib/format"
import { UnitEconomicsLedger } from "@/components/client-diagnostic-expanded"
import type { EnrichedClient, Invoice } from "@/lib/db/types"
import { getClientProfileData, getInvoicesByClient } from "@/lib/db/services"

const mrrChartConfig = {
  mrr: { label: "MRR", color: "var(--color-brand-500)" },
} satisfies ChartConfig

function deriveClientSince(tenureMonths: number): { label: string; years: number; months: number } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - tenureMonths, 1)
  const label = start.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  const years = Math.floor(tenureMonths / 12)
  const months = tenureMonths % 12
  return { label, years, months }
}

function KPICard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-bold font-mono tabular-nums text-foreground">
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-muted-foreground">{subtext}</span>
      )}
    </div>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const isOverdue = invoice.status === "Overdue"
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
        <span className="text-xs text-muted-foreground">
          Due {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className={cn("text-sm font-mono tabular-nums font-medium", isOverdue && "text-destructive")}>
          {formatCurrencyFull(invoice.amount)}
        </span>
        {isOverdue && (
          <span className="text-xs text-destructive font-medium">
            {invoice.daysOverdue}d overdue
          </span>
        )}
        {invoice.status === "Open" && (
          <span className="text-xs text-muted-foreground">Open</span>
        )}
      </div>
    </div>
  )
}

interface ClientProfileDrawerProps {
  clientId: string | null
}

export function ClientProfileDrawer({ clientId }: ClientProfileDrawerProps) {
  const [client, setClient] = React.useState<EnrichedClient | null>(null)
  const [activeClientCount, setActiveClientCount] = React.useState(0)
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!clientId) return
    let isMounted = true
    setLoading(true)

    Promise.all([
      getClientProfileData(clientId),
      getInvoicesByClient(clientId),
    ]).then(([profileData, invoicesData]) => {
      if (isMounted) {
        setClient(profileData?.client ?? null)
        setActiveClientCount(profileData?.activeClientCount ?? 0)
        setInvoices(invoicesData.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()))
        setLoading(false)
      }
    })

    return () => { isMounted = false }
  }, [clientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Loading client profile…
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Client not found.
      </div>
    )
  }

  const since = deriveClientSince(client.tenure_months)
  const tenureLabel = [
    since.years > 0 ? `${since.years} Yr${since.years !== 1 ? "s" : ""}` : null,
    since.months > 0 ? `${since.months} Mo${since.months !== 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(", ")

  const openInvoices = invoices.filter(i => i.status !== "Paid")
  const overdueInvoices = openInvoices.filter(i => i.status === "Overdue")

  return (
    <>
      {/* Header */}
      <SheetHeader className="px-6 pt-6 pb-6 border-b border-border text-left">
        <SheetTitle className="text-2xl font-bold tracking-tight">{client.name}</SheetTitle>
        <SheetDescription>
          Client Since: {since.label} ({tenureLabel})
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-8 px-6 pb-6 pt-6">

      {/* Section 1: KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard
          label="Lifetime Value"
          value={formatCurrencyFull(client.marginLTV)}
        />
        <KPICard
          label="Gross Margin"
          value={`${(client.margin * 100).toFixed(1)}%`}
        />
        <KPICard
          label="Profit Rank"
          value={client.profitRank > 0 ? `#${client.profitRank}` : "N/A"}
          subtext={client.profitRank > 0 ? `of ${activeClientCount} Most Profitable` : "Churned"}
        />
        <KPICard
          label="Total Invoiced"
          value={formatCurrencyFull(client.totalInvoiced)}
        />
      </div>

      {/* Section 2: MRR Trajectory */}
      {client.clientMrrHistory.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            MRR Trajectory
          </h3>
          <ChartContainer config={mrrChartConfig} className="w-full h-[250px] !aspect-auto">
            <AreaChart
              data={client.clientMrrHistory}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={50}
              />
              <ChartTooltip
                cursor
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => String(value)}
                    formatter={(value) => (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--color-brand-500)]" />
                        <span className="text-muted-foreground">MRR</span>
                        <span className="font-mono font-medium text-foreground tabular-nums ml-auto">
                          {formatCurrencyFull(value as number)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="stepAfter"
                dataKey="mrr"
                stroke="var(--color-brand-500)"
                strokeWidth={2}
                fill="url(#mrrFill)"
                fillOpacity={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

      {/* Section 3: Cash Flow */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Cash Flow
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Open & Overdue Invoices */}
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Open & Overdue
            </span>
            {openInvoices.length === 0 ? (
              <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>All caught up</span>
              </div>
            ) : (
              <div className="mt-2 flex flex-col">
                {overdueInvoices.length > 0 && (
                  <div className="mb-2 text-xs font-medium text-destructive">
                    {overdueInvoices.length} overdue
                  </div>
                )}
                {openInvoices.map(inv => (
                  <InvoiceRow key={inv.id} invoice={inv} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Payment Speed */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Days to Pay
            </span>
            <span className={cn(
              "text-3xl font-bold font-mono tabular-nums mt-3",
              client.avgDaysToPay > 30 ? "text-destructive" : "text-foreground"
            )}>
              {client.avgDaysToPay}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              days average
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: Unit Economics */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Unit Economics
        </h3>
        <UnitEconomicsLedger mrr={client.mrr} unitEconomics={client.unitEconomics} />
      </div>
      </div>
    </>
  )
}
