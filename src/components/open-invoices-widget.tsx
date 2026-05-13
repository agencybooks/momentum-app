import type { ARAgingSummary } from "@/lib/db/types"
import type { Invoice, Client } from "@/lib/db/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const BUCKET_COLORS = [
  "bg-emerald-500",
  "bg-amber-400",
  "bg-amber-500",
  "bg-destructive",
]

export function OpenInvoicesWidget({
  agingSummary,
  openInvoices,
  clients,
}: {
  agingSummary: ARAgingSummary
  openInvoices: Invoice[]
  clients: Client[]
}) {
  const clientMap = new Map(clients.map((c) => [c.id, c.name]))

  const sorted = [...openInvoices]
    .sort((a, b) => {
      if (a.status === "Overdue" && b.status !== "Overdue") return -1
      if (a.status !== "Overdue" && b.status === "Overdue") return 1
      if (a.status === "Overdue" && b.status === "Overdue") return b.daysOverdue - a.daysOverdue
      return b.amount - a.amount
    })

  return (
    <Card className="flex flex-col border-border bg-card h-full">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">Accounts Receivable</CardTitle>
          <Link href="/cash">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All
            </Button>
          </Link>
        </div>

        {/* A/R Aging Buckets */}
        <div className="pt-2">
          <div className="grid grid-cols-4 gap-3">
            {agingSummary.buckets.map((bucket, i) => (
              <div key={bucket.label}>
                <p className="text-xs text-muted-foreground mb-1">{bucket.label}</p>
                <p
                  className={cn(
                    "text-sm font-semibold font-mono tabular-nums",
                    i === 3 && "text-destructive"
                  )}
                >
                  {fmt.format(bucket.amount)}
                </p>
              </div>
            ))}
          </div>

          {/* Concentration bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden mt-3 bg-muted">
            {agingSummary.buckets.map((bucket, i) => (
              <div
                key={bucket.label}
                className={cn("h-full", BUCKET_COLORS[i])}
                style={{ width: `${(bucket.amount / agingSummary.totalOutstanding) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr_6rem_6rem] items-center px-7 pb-2 border-b border-border mt-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Client</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-right">Amount</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-right">Status</span>
      </div>

      {/* Invoice List */}
      <CardContent className="flex-1 overflow-y-auto px-4 pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <p className="text-sm">All caught up. No open invoices.</p>
          </div>
        ) : (
          sorted.map((inv) => (
            <div
              key={inv.id}
              className="group grid grid-cols-[1fr_6rem_6rem] items-center py-3 px-3 border-b border-border/40 last:border-0 rounded-md transition-colors hover:bg-zinc-50/50 dark:hover:bg-white/5"
            >
              <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                <span className="font-medium text-sm text-foreground truncate">
                  {clientMap.get(inv.clientId) ?? "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">{inv.invoiceNumber}</span>
              </div>

              <span className="font-mono tabular-nums text-sm font-medium text-foreground text-right">
                {fmt.format(inv.amount)}
              </span>

              <span className={cn(
                "text-sm font-medium text-right whitespace-nowrap",
                inv.status === "Overdue"
                  ? inv.daysOverdue >= 60
                    ? "text-destructive"
                    : "text-warning"
                  : "text-muted-foreground"
              )}>
                {inv.status === "Overdue" ? `${inv.daysOverdue}d overdue` : "Open"}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
