"use client"

import { TrendingDown } from "lucide-react"

interface ClientShockTestProps {
  clientName: string
  revenueImpact: string
  annualizedImpact: string
  runwayBefore: string
  runwayAfter: string
  runwayDelta: string
  newTopClient: string
  newTopClientPct: string
}

export function ClientShockTest({
  clientName,
  revenueImpact,
  annualizedImpact,
  runwayBefore,
  runwayAfter,
  runwayDelta,
  newTopClient,
  newTopClientPct,
}: ClientShockTestProps) {
  return (
    <div className="bg-zinc-50/50 dark:bg-surface-inset border-l-[3px] border-brand-500 p-6 shadow-inner flex flex-col gap-6">
      <span className="text-sm font-medium text-foreground flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-muted-foreground" />
        What if {clientName} leaves?
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Revenue Impact
          </span>
          <span className="text-destructive text-xl font-bold tabular-nums mt-1">
            {revenueImpact}{" "}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {annualizedImpact}
          </span>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cash Runway Impact
          </span>
          <span className="text-foreground text-xl font-bold tabular-nums mt-1">
            {runwayBefore}{" "}
            <span className="text-muted-foreground font-normal text-sm">mo</span>
            {" → "}
            {runwayAfter}{" "}
            <span className="text-muted-foreground font-normal text-sm">mo</span>
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {runwayDelta}
          </span>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Top Client
          </span>
          <span className="text-foreground text-xl font-bold mt-1">
            {newTopClient}
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {newTopClientPct}
          </span>
        </div>
      </div>
    </div>
  )
}
