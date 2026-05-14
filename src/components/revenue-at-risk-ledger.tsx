"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { renewalAtRiskData } from "@/lib/mock-data"
import type { RenewalAtRisk } from "@/lib/db/types"

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function urgencyColor(status: RenewalAtRisk["status"]): string {
  if (status === "critical") return "text-destructive"
  if (status === "warning") return "text-warning"
  return "text-muted-foreground"
}

function RenewalRow({ renewal }: { renewal: RenewalAtRisk }) {
  return (
    <div className="group grid grid-cols-[1fr_6rem_5.5rem] items-center py-3 px-3 border-b border-border/30 last:border-0 rounded-md transition-colors hover:bg-muted/50 dark:hover:bg-white/5">
      <span className="font-medium text-sm text-foreground truncate pr-2">
        {renewal.clientName}
      </span>
      <span className="font-mono tabular-nums text-sm font-medium text-foreground text-right">
        {currencyFmt.format(renewal.mrrValue)}/mo
      </span>
      <span className={cn("text-sm font-medium text-right whitespace-nowrap", urgencyColor(renewal.status))}>
        {renewal.daysUntilRenewal === 1 ? "1 Day" : `${renewal.daysUntilRenewal} Days`}
      </span>
    </div>
  )
}

export function RevenueAtRiskLedger() {
  const sorted = [...renewalAtRiskData].sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)
  const totalAtRisk = sorted.reduce((sum, r) => sum + r.mrrValue, 0)

  return (
    <Card className="flex flex-col border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">Revenue at Risk</CardTitle>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <span className="text-sm text-muted-foreground">
            Total at Risk:{" "}
            <span className="font-semibold text-destructive font-mono tabular-nums">{currencyFmt.format(totalAtRisk)}/mo</span>
          </span>
        </div>
      </CardHeader>
      <div className="grid grid-cols-[1fr_6rem_5.5rem] items-center px-7 pb-2 border-b border-border">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Client</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-right">MRR</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-right">Renews In</span>
      </div>
      <CardContent className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        {sorted.length === 0 ? (
          <EmptyState 
            icon={AlertTriangle}
            title="No renewals in the next 90 days" 
            description="You have no revenue at risk from upcoming renewals."
          />
        ) : (
          sorted.map((renewal) => (
            <RenewalRow key={renewal.id} renewal={renewal} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
