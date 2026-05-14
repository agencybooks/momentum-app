"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatCurrencyFull } from "@/lib/format"
import type { EnrichedClient } from "@/lib/db/types"
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"

type SegmentGroup = "top" | "mid" | "tail"

interface BarSegment {
  name: string
  percent: number
  value: number
  group: SegmentGroup
  breachesCeiling: boolean
  rankInGroup: number
  clientCount?: number
}

interface ConcentrationRiskWidgetProps {
  clients: EnrichedClient[]
  totalMrr: number
  ceilingPercent?: number
}

function getSegmentColor(seg: BarSegment): string {
  const { rankInGroup } = seg
  if (seg.breachesCeiling) return "bg-destructive"
  if (seg.group === "top") {
    return rankInGroup === 0 ? "bg-brand-500/80" : "bg-brand-500/60"
  }
  if (seg.group === "mid") return "bg-brand-500/40"
  return "bg-muted stripe-subtle"
}

function getSegmentTextColor(seg: BarSegment): string {
  if (seg.breachesCeiling) return "text-primary-foreground"
  if (seg.group === "tail") return "text-muted-foreground"
  return "text-primary-foreground/90"
}

export function ConcentrationRiskWidget({
  clients,
  totalMrr,
  ceilingPercent = 25,
}: ConcentrationRiskWidgetProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { segments, top3Pct, maxRunwayImpact } = useMemo(() => {
    const active = clients
      .filter((c) => c.mrr > 0)
      .sort((a, b) => b.mrr - a.mrr)

    if (active.length === 0 || totalMrr <= 0) {
      return { segments: [], top3Pct: 0, maxRunwayImpact: 0 }
    }

    const result: BarSegment[] = []

    const top3 = active.slice(0, 3)
    let topNonBreachRank = 0
    top3.forEach((c) => {
      const pct = (c.mrr / totalMrr) * 100
      const breaches = pct >= ceilingPercent
      result.push({
        name: c.name,
        percent: pct,
        value: c.mrr,
        group: "top",
        breachesCeiling: breaches,
        rankInGroup: breaches ? 0 : topNonBreachRank++,
      })
    })

    const mid = active.slice(3, 6)
    mid.forEach((c, i) => {
      const pct = (c.mrr / totalMrr) * 100
      result.push({
        name: c.name,
        percent: pct,
        value: c.mrr,
        group: "mid",
        breachesCeiling: pct >= ceilingPercent,
        rankInGroup: i,
      })
    })

    const tail = active.slice(6)
    if (tail.length > 0) {
      const tailVal = tail.reduce((sum, c) => sum + c.mrr, 0)
      const tailPct = (tailVal / totalMrr) * 100
      result.push({
        name: `All Other Clients (${tail.length})`,
        percent: tailPct,
        value: tailVal,
        group: "tail",
        breachesCeiling: false,
        rankInGroup: 0,
        clientCount: tail.length,
      })
    }

    const t3Pct = result
      .filter((s) => s.group === "top")
      .reduce((sum, s) => sum + s.percent, 0)

    const maxImpact = top3.reduce(
      (max, c) => Math.max(max, c.runwayImpact),
      0
    )

    return { segments: result, top3Pct: t3Pct, maxRunwayImpact: maxImpact }
  }, [clients, totalMrr, ceilingPercent])

  const metricLabel = "revenue"

  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Concentration Risk
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <EmptyState 
            icon={Users}
            title="Add clients to see concentration risk" 
            description="Your concentration risk will appear once you have active clients."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">
          Concentration Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* Bar + ceiling line */}
        <TooltipProvider delay={100}>
          <div
            className="relative w-full"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Ceiling label */}
            <div
              className="absolute -top-5 z-10 pointer-events-none"
              style={{ left: `${ceilingPercent}%` }}
            >
              <span className="relative -translate-x-1/2 text-xs text-foreground font-medium whitespace-nowrap tabular-nums">
                {ceilingPercent}% ceiling
              </span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-10 flex rounded-lg overflow-hidden">
              {segments.map((seg, i) => {
                const isLast = i === segments.length - 1
                return (
                  <Tooltip key={seg.name}>
                    <TooltipTrigger
                      render={<div />}
                      className={cn(
                        "h-full flex items-center transition-opacity duration-200 cursor-default",
                        getSegmentColor(seg),
                        !isLast && "border-r border-background/20",
                        hoveredIndex !== null &&
                          hoveredIndex !== i &&
                          "opacity-50"
                      )}
                      style={isLast ? { flex: 1 } : { width: `${seg.percent}%` }}
                      onMouseEnter={() => setHoveredIndex(i)}
                    >
                      {seg.percent > 15 && (
                        <span
                          className={cn(
                            "text-[11px] font-medium truncate px-2 pointer-events-none",
                            getSegmentTextColor(seg)
                          )}
                        >
                          {seg.name}
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{seg.name}</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrencyFull(seg.value)}/mo
                        </span>
                        <span className="tabular-nums">
                          {seg.percent.toFixed(1)}% of total {metricLabel}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>

            {/* Risk ceiling line */}
            <div
              className="absolute top-0 h-full border-l-2 border-dashed border-white z-20 pointer-events-none drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]"
              style={{ left: `${ceilingPercent}%` }}
            />
          </div>
        </TooltipProvider>

        {/* CFO Insight */}
        <p className="text-sm text-muted-foreground leading-snug">
          Your top 3 clients represent{" "}
          <span className="text-foreground font-medium tabular-nums">
            {Math.round(top3Pct)}%
          </span>{" "}
          of your {metricLabel}. The loss of any one of them reduces runway by{" "}
          <span className="text-foreground font-medium tabular-nums">
            &gt;{maxRunwayImpact.toFixed(1)} month
            {maxRunwayImpact !== 1 ? "s" : ""}
          </span>
          .
        </p>
      </CardContent>
    </Card>
  )
}
