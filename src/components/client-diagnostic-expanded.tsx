"use client"

import { TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnrichedClient } from "@/lib/db/types"

function formatCurrencyFull(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val)
}

function RunwayImpactPane({
  clientName,
  shockTest,
}: {
  clientName: string
  shockTest: EnrichedClient["shockTest"]
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <TrendingDown className="w-4 h-4" />
        What if {clientName} leaves?
      </span>
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Revenue Impact
          </span>
          <span className="text-destructive text-xl font-bold tabular-nums mt-1">
            {shockTest.revenueImpact}{" "}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {shockTest.annualizedImpact}
          </span>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cash Runway Impact
          </span>
          <span className="text-foreground text-xl font-bold tabular-nums mt-1">
            {shockTest.runwayBefore}{" "}
            <span className="text-muted-foreground font-normal text-sm">mo</span>
            {" → "}
            {shockTest.runwayAfter}{" "}
            <span className="text-muted-foreground font-normal text-sm">mo</span>
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {shockTest.runwayDelta}
          </span>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Top Client
          </span>
          <span className="text-foreground text-xl font-bold mt-1">
            {shockTest.newTopClient}
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {shockTest.newTopClientPct}
          </span>
        </div>
      </div>
    </div>
  )
}

export function UnitEconomicsLedger({
  mrr,
  unitEconomics,
}: {
  mrr: number
  unitEconomics: EnrichedClient["unitEconomics"]
}) {
  return (
    <div className="bg-background border border-border rounded-lg p-5 flex flex-col gap-3 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Unit Economics Breakdown
      </span>

      <div className="flex flex-col gap-2.5 font-mono text-sm">
        <div className="flex justify-between items-baseline">
          <span className="text-foreground">Revenue</span>
          <span className="tabular-nums font-medium">{formatCurrencyFull(mrr)}</span>
        </div>

        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Less: Direct Labor</span>
            <span className="text-[10px] text-muted-foreground/60 leading-tight">
              Pulled from Toggl/Harvest
            </span>
          </div>
          <span className="tabular-nums text-destructive shrink-0">
            −{formatCurrencyFull(unitEconomics.directLaborCost)}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Less: Software/Ad Spend</span>
          <span className="tabular-nums text-destructive shrink-0">
            −{formatCurrencyFull(unitEconomics.softwareAdSpend)}
          </span>
        </div>

        <div className="border-t border-dashed border-border my-1" />

        <div className="flex justify-between items-start font-bold">
          <span className="text-foreground">= Net Client Profit</span>
          <div className="flex flex-col items-end">
            <span
              className={cn(
                "tabular-nums",
                unitEconomics.netClientProfit < 0
                  ? "text-destructive"
                  : "text-foreground"
              )}
            >
              {formatCurrencyFull(unitEconomics.netClientProfit)}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {(unitEconomics.netMarginPct * 100).toFixed(1)}% Margin
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientDiagnosticExpanded({ client }: { client: EnrichedClient }) {
  return (
    <div
      className={cn(
        "bg-zinc-50/50 dark:bg-zinc-900/50 border-l-2 p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
        client.margin < 0.4 ? "border-destructive" : "border-brand-500"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RunwayImpactPane
          clientName={client.name}
          shockTest={client.shockTest}
        />
        <UnitEconomicsLedger
          mrr={client.mrr}
          unitEconomics={client.unitEconomics}
        />
      </div>
    </div>
  )
}
