"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AreaChart, Area } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { ArrowUp, ArrowDown } from "lucide-react"

export interface MetricAnchorProps {
  title: string
  value: string | number
  target?: string
  trendText?: string
  trendUp?: boolean
  trendDirection?: "up-is-good" | "down-is-good"
  isHealthy: boolean
  targetLabel?: string
  className?: string
  onClick?: () => void
  sparklineData?: { date: string; value: number }[]
  sentiment?: "positive" | "negative" | "neutral"
}

export function MetricAnchor({
  title,
  value,
  target,
  trendText,
  trendUp,
  trendDirection,
  isHealthy,
  targetLabel,
  className,
  onClick,
  sparklineData,
  sentiment,
}: MetricAnchorProps) {
  let trendPositive: boolean
  if (trendDirection && trendUp !== undefined) {
    trendPositive = trendDirection === "up-is-good" ? trendUp : !trendUp
  } else {
    trendPositive = trendUp ?? isHealthy
  }

  const sparklineColor = sentiment === "positive"
    ? "var(--color-success)"
    : sentiment === "negative"
    ? "var(--color-destructive)"
    : "var(--color-muted-foreground)"

  return (
    <Card
      className={cn(
        "relative overflow-hidden flex flex-col h-[140px] p-0 border-border/60 shadow-sm group",
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col p-4 pb-0 relative z-10 bg-gradient-to-b from-card via-card/90 to-transparent">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            {title}
          </span>
          {(trendText || target) && (
            <div className="flex items-center gap-2 justify-end shrink-0">
              {trendText && (() => {
                const vsIndex = trendText.indexOf(" vs ")
                const delta = vsIndex !== -1 ? trendText.slice(0, vsIndex) : trendText
                return (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                    trendPositive ? "text-success" : "text-destructive"
                  )}>
                    {trendPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {delta}
                  </span>
                )
              })()}
              {target && (
                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                  (Goal: {target})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-1">
          <span className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </span>
          {targetLabel && (
            <p className="text-xs text-destructive font-medium mt-1">{targetLabel}</p>
          )}
        </div>
      </div>

      {sparklineData && sparklineData.length > 0 && (() => {
        const gradientId = `sparkline-${title.replace(/[^a-zA-Z0-9]/g, '')}`
        const sparkConfig = {
          value: { label: title, color: sparklineColor },
        } satisfies ChartConfig

        return (
          <div className="mt-auto h-[50px] w-full relative z-0 overflow-hidden">
            <ChartContainer config={sparkConfig} className="w-full h-full !aspect-auto p-0 m-0">
              <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={sparklineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  fillOpacity={0.6}
                  fill={`url(#${gradientId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )
      })()}
    </Card>
  )
}
