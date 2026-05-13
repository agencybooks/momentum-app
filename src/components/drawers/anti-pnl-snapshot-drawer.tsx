"use client"

import { useState, useEffect } from "react"
import { useQueryState } from "nuqs"
import { Download, AlertTriangle, TrendingUp, TrendingDown, Minus, CheckCircle2, ChevronDown } from "lucide-react"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { antiPnlSnapshots } from "@/lib/db/mock-db"
import type { AntiPnLQuadrant, TargetYieldGoal } from "@/lib/db/types"

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

function AntiPnLCard({ quadrant, title }: { quadrant: AntiPnLQuadrant; title: string }) {
  const TrendIcon = quadrant.heroTrend ? trendIcon[quadrant.heroTrend] : null
  const trendColor = quadrant.heroTrend === "up"
    ? "text-success"
    : quadrant.heroTrend === "down"
      ? "text-destructive"
      : "text-muted-foreground"

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </div>
      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-1">{quadrant.heroLabel}</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
            {quadrant.heroValue}
          </span>
          {TrendIcon && <TrendIcon className={cn("h-4 w-4", trendColor)} />}
        </div>
      </div>
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{quadrant.secondaryLabel}:</span>
          <span className={cn(
            "font-medium font-mono tabular-nums",
            quadrant.warningThreshold ? "text-warning" : "text-foreground"
          )}>
            {quadrant.secondaryValue}
          </span>
          {quadrant.warningThreshold && (
            <AlertTriangle className="h-3 w-3 text-warning" />
          )}
        </div>
      </div>
    </Card>
  )
}

function GoalRow({ goal, variant }: { goal: TargetYieldGoal; variant: "offTrack" | "onTrack" }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-1 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
      <span className="text-sm font-medium text-foreground truncate mr-2">
        {goal.metric}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs tabular-nums text-muted-foreground">
          {goal.actual}
        </span>
        <span className={cn(
          "text-xs tabular-nums font-medium",
          variant === "offTrack" ? "text-destructive" : "text-muted-foreground"
        )}>
          {goal.variance}
        </span>
      </div>
    </div>
  )
}

function TargetYieldSection({ targetYield }: {
  targetYield: { met: number; total: number; offTrack: TargetYieldGoal[]; onTrack: TargetYieldGoal[] }
}) {
  const [animateYield, setAnimateYield] = useState(false)
  const [showAllOnTrack, setShowAllOnTrack] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateYield(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const { met, total, offTrack, onTrack } = targetYield
  const percent = Math.round((met / total) * 100)
  const hiddenCount = onTrack.length - 3

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Target Yield
        </div>
        <div className="text-xs font-semibold tabular-nums text-foreground">
          {met}/{total} Met
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden bg-[color:var(--color-brand-500)]/10">
        <div
          className="h-full rounded-full bg-[color:var(--color-brand-500)] transition-all duration-700 ease-out"
          style={{ width: animateYield ? `${percent}%` : "0%" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-lg border border-border/50 bg-zinc-50/50 dark:bg-black/20 p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
              Off Track
            </span>
          </div>
          <div className="flex flex-col">
            {offTrack.map((goal) => (
              <GoalRow key={goal.metric} goal={goal} variant="offTrack" />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-zinc-50/50 dark:bg-black/20 p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              On Track
            </span>
          </div>
          <div className="flex flex-col">
            {onTrack.slice(0, 3).map((goal) => (
              <GoalRow key={goal.metric} goal={goal} variant="onTrack" />
            ))}

            {hiddenCount > 0 && (
              <>
                <div className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  showAllOnTrack ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    {onTrack.slice(3).map((goal) => (
                      <GoalRow key={goal.metric} goal={goal} variant="onTrack" />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowAllOnTrack((prev) => !prev)}
                  className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1.5"
                >
                  {showAllOnTrack ? "Show fewer" : `View all ${onTrack.length} on-track goals`}
                  <ChevronDown className={cn(
                    "h-3 w-3 inline ml-1 transition-transform duration-200",
                    showAllOnTrack && "rotate-180"
                  )} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AntiPnlSnapshotDrawer() {
  const [period] = useQueryState("period")
  const snapshot = period ? antiPnlSnapshots[period] : null

  if (!snapshot) {
    return (
      <>
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold tracking-tight">Snapshot Not Found</SheetTitle>
        </SheetHeader>
        <Separator className="my-6" />
        <p className="px-4 text-sm text-muted-foreground">No snapshot data available for this period.</p>
      </>
    )
  }

  return (
    <>
      <SheetHeader>
        <div className="flex items-center justify-between pr-20">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            {snapshot.period}
          </SheetTitle>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </SheetHeader>

      <Separator className="my-6" />

      <div className="flex flex-col gap-6 px-4 pb-8">
        {snapshot.varianceDrift && (
          <Alert variant="warning" className="animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Variance Detected</AlertTitle>
            <AlertDescription className="text-xs">{snapshot.driftMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 pt-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Executive Summary
              </div>
              {snapshot.executiveSummary.insights.map((insight, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                  {insight}
                </p>
              ))}
            </div>
            <div className="border-2 border-destructive rounded-lg p-4">
              <div className="text-[10px] font-semibold text-destructive uppercase tracking-widest mb-2">
                Top Priority
              </div>
              <div className="text-sm font-semibold mb-1">{snapshot.executiveSummary.topPriority.label}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{snapshot.executiveSummary.topPriority.detail}</p>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Performance Drivers
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AntiPnLCard quadrant={snapshot.quadrants.clientRev} title="Client / Rev" />
            <AntiPnLCard quadrant={snapshot.quadrants.growth} title="Growth" />
            <AntiPnLCard quadrant={snapshot.quadrants.efficiency} title="Efficiency" />
            <AntiPnLCard quadrant={snapshot.quadrants.liquidity} title="Liquidity" />
          </div>
        </div>

        {snapshot.targetYield && (
          <TargetYieldSection targetYield={snapshot.targetYield} />
        )}
      </div>
    </>
  )
}
