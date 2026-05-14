import type { ScorecardMonth } from "@/lib/db/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, ArrowUp, ArrowDown, FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function formatCompact(value: number) {
  if (value >= 1000) {
    const k = value / 1000
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
  }
  return fmt.format(value)
}

type TrendDirection = "up" | "down" | "flat"

function parseTrend(raw: string): { direction: TrendDirection; label: string } {
  const trimmed = raw.trim()
  if (trimmed.startsWith("↑")) {
    return { direction: "up", label: trimmed.slice(1).trim() || "—" }
  }
  if (trimmed.startsWith("↓")) {
    return { direction: "down", label: trimmed.slice(1).trim() || "—" }
  }
  return { direction: "flat", label: trimmed || "—" }
}

function TrendPill({ trend, isArchived = false }: { trend: string; isArchived?: boolean }) {
  const { direction, label } = parseTrend(trend)
  const isPositive = direction === "up"
  const isNegative = direction === "down"

  return (
    <span
      className={cn(
        "inline-flex items-center justify-end min-w-[3.5rem] text-xs font-semibold tabular-nums",
        isPositive && "text-success dark:text-success",
        isNegative && "text-destructive",
        !isPositive && !isNegative && "text-muted-foreground",
        isArchived && "opacity-50 group-hover/scorecard:opacity-100 transition-opacity duration-200 ease-in-out"
      )}
    >
      {isPositive && <ArrowUp className="w-3 h-3 mr-0.5 shrink-0" />}
      {isNegative && <ArrowDown className="w-3 h-3 mr-0.5 shrink-0" />}
      {label}
    </span>
  )
}

function MetricCell({ label, value, trend, isArchived = false }: { label: string; value: string; trend: string; isArchived?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="uppercase text-xs text-muted-foreground tracking-wider font-medium">
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={cn(
          "font-mono tabular-nums text-lg font-medium",
          isArchived && "text-muted-foreground group-hover/scorecard:text-foreground transition-colors duration-200 ease-in-out"
        )}>
          {value}
        </span>
        <TrendPill trend={trend} isArchived={isArchived} />
      </div>
    </div>
  )
}

function ScorecardWidget({ scorecard: sc }: { scorecard: ScorecardMonth }) {
  const isArchived = !sc.isCurrent

  return (
    <Link
      href={sc.href}
      className={cn(
        "group/scorecard block rounded-xl border border-border/50 bg-muted/30 dark:bg-surface-inset p-5",
        isArchived
          ? "transition-all duration-200 ease-in-out hover:bg-muted dark:hover:bg-white/10 hover:border-border"
          : "transition-all duration-200 hover:bg-muted dark:hover:bg-white/10 hover:border-border",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/75"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "text-sm font-semibold",
          isArchived && "text-muted-foreground group-hover/scorecard:text-foreground transition-colors duration-200 ease-in-out"
        )}>
          {sc.month}
        </span>
        <Badge
          variant="secondary"
          className={cn(
            "border-0 text-xs tracking-wider uppercase font-semibold",
            sc.isCurrent
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "bg-muted text-muted-foreground"
          )}
        >
          {sc.isCurrent ? "Current" : "Archived"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCell label="Revenue" value={formatCompact(sc.revenue)} trend={sc.revenueTrend} isArchived={isArchived} />
        <MetricCell label="Gross Margin" value={`${sc.grossMarginPct}%`} trend={sc.grossMarginTrend} isArchived={isArchived} />
        <MetricCell label="Net Income" value={formatCompact(sc.netIncome)} trend={sc.netIncomeTrend} isArchived={isArchived} />
      </div>

      <div className="flex justify-end mt-4">
        <span className={cn(
          "text-sm text-muted-foreground flex items-center gap-1 group-hover/scorecard:translate-x-1",
          isArchived
            ? "transition-transform duration-200 ease-in-out"
            : "transition-transform duration-200"
        )}>
          View Report
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export function RecentScorecardsList({ scorecards }: { scorecards: ScorecardMonth[] }) {
  return (
    <Card className="border-border bg-card shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-medium text-foreground tracking-tight">Recent Scorecards</h3>
        <Link href="/scorecards">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View Archive
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {scorecards.length > 0 ? (
          scorecards.map((sc) => (
            <ScorecardWidget key={sc.month} scorecard={sc} />
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No scorecards generated"
            description="Scorecards are generated automatically at the end of each month."
          />
        )}
      </div>
    </Card>
  )
}
