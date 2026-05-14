"use client"

import { useMemo, useState, useCallback } from "react"
import { Treemap, Tooltip } from "recharts"
import type { TreemapNode } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"
import type { EnrichedClient } from "@/lib/db/types"
import { EmptyState } from "@/components/ui/empty-state"
import { Clock } from "lucide-react"

type MomentumStatus = "expanding" | "flat" | "contracting"

interface SubClient {
  name: string
  mrr: number
  momentum: number
  status: MomentumStatus
}

interface StatusBreakdown {
  expanding: number
  flat: number
  contracting: number
}

interface MomentumNode {
  name: string
  value: number
  momentum: number
  status: MomentumStatus
  fill: string
  subClients?: SubClient[]
  count?: number
  statusBreakdown?: StatusBreakdown
  [key: string]: unknown
}

const MIN_PCT = 0.03
const MAX_BLOCKS = 12
const PREVIEW_COUNT = 3
const MOMENTUM_THRESHOLD = 0.02

function computeMomentum(history: { month: string; mrr: number }[]): number {
  if (history.length < 4) return 0
  const current = history[history.length - 1]!.mrr
  const prior = history[history.length - 4]!.mrr
  if (prior === 0) return current > 0 ? 1 : 0
  return (current - prior) / prior
}

function getStatus(momentum: number): MomentumStatus {
  if (momentum > MOMENTUM_THRESHOLD) return "expanding"
  if (momentum < -MOMENTUM_THRESHOLD) return "contracting"
  return "flat"
}

const FLAT_COLOR = "var(--color-muted-foreground)"

function getMomentumColor(status: MomentumStatus): string {
  switch (status) {
    case "expanding":
      return "var(--success)"
    case "contracting":
      return "var(--destructive)"
    case "flat":
      return FLAT_COLOR
  }
}

function getStatusLabel(status: MomentumStatus): string {
  switch (status) {
    case "expanding":
      return "Expanding"
    case "contracting":
      return "Contracting"
    case "flat":
      return "Flat"
  }
}

function formatMomentum(m: number): string {
  const pct = (m * 100).toFixed(1)
  if (m > 0) return `+${pct}%`
  if (m < 0) return `${pct}%`
  return "0%"
}

const chartConfig = {
  mrr: { label: "MRR" },
} satisfies ChartConfig

function CustomTreemapContent(
  props: TreemapNode & { hoveredNode: string | null; onHover: (name: string | null) => void }
) {
  const { x, y, width, height, name, hoveredNode, onHover } = props
  const momentum = (props as Record<string, unknown>).momentum as number
  const status = (props as Record<string, unknown>).status as MomentumStatus
  const fill = (props as Record<string, unknown>).fill as string
  const isOther = !!(props as Record<string, unknown>).subClients

  const showFull = width > 80 && height > 40
  const showCompact = !showFull && width > 28 && height > 20
  const maxChars = Math.floor(width / 8)
  const truncatedName =
    name && name.length > maxChars ? `${name.slice(0, maxChars - 1)}…` : name
  const compactChars = Math.max(2, Math.floor(width / 9))
  const compactName = name
    ? name.length > compactChars
      ? `${name.slice(0, compactChars)}…`
      : name
    : ""

  const isDimmed = hoveredNode !== null && hoveredNode !== name
  const isHighlighted = hoveredNode === name

  return (
    <g
      onMouseEnter={() => onHover(name ?? null)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {isOther && (
        <defs>
          <pattern
            id="momentum-other-hatch"
            patternUnits="userSpaceOnUse"
            width={6}
            height={6}
            patternTransform="rotate(45)"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={6}
              stroke="var(--background)"
              strokeWidth={1}
              strokeOpacity={0.18}
            />
          </pattern>
        </defs>
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        style={{
          fill,
          stroke: "var(--background)",
          strokeWidth: 2,
          opacity: isDimmed ? 0.55 : 1,
          filter: isHighlighted ? "brightness(1.15)" : undefined,
          transition: "opacity 150ms ease, filter 150ms ease",
        }}
      />
      {isOther && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          fill="url(#momentum-other-hatch)"
          style={{
            pointerEvents: "none",
            opacity: isDimmed ? 0.55 : 1,
            transition: "opacity 150ms ease",
          }}
        />
      )}
      {showFull && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fill: "white",
              fontSize: 11,
              fontWeight: 500,
              pointerEvents: "none",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              opacity: isDimmed ? 0.5 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {truncatedName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fill: "white",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontVariantNumeric: "tabular-nums",
              pointerEvents: "none",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              opacity: isDimmed ? 0.5 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {formatMomentum(momentum)}
          </text>
        </>
      )}
      {showCompact && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fill: "white",
            fontSize: 9,
            fontWeight: 500,
            pointerEvents: "none",
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            opacity: isDimmed ? 0.5 : 0.85,
            transition: "opacity 150ms ease",
          }}
        >
          {compactName}
        </text>
      )}
    </g>
  )
}

function MomentumTooltipContent({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: Record<string, unknown> }>
}) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload as unknown as MomentumNode | undefined
  if (!data) return null

  const statusDot =
    data.status === "expanding"
      ? "bg-success"
      : data.status === "contracting"
        ? "bg-destructive"
        : "bg-muted-foreground"

  if (data.subClients) {
    const preview = data.subClients.slice(0, PREVIEW_COUNT)
    const remaining = data.subClients.length - PREVIEW_COUNT
    const sb = data.statusBreakdown

    return (
      <div className="w-72 rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-xl">
        <p className="text-sm font-medium">
          All Other Clients ({data.count} accounts)
        </p>
        <div className="flex justify-between gap-6 mt-1.5">
          <span className="text-xs text-muted-foreground">Combined MRR</span>
          <span className="text-xs font-mono tabular-nums text-right">
            {formatCurrency(data.value)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-xs text-muted-foreground">Blended Momentum</span>
          <span className="text-xs font-mono tabular-nums text-right font-medium">
            {formatMomentum(data.momentum)}
          </span>
        </div>
        {sb && (
          <div className="flex items-center gap-3 mt-2 text-xs">
            {sb.expanding > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                {sb.expanding} Growing
              </span>
            )}
            {sb.flat > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
                {sb.flat} Flat
              </span>
            )}
            {sb.contracting > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                {sb.contracting} Shrinking
              </span>
            )}
          </div>
        )}
        {preview.length > 0 && (
          <div className="border-t border-border mt-2 pt-2 space-y-1">
            {preview.map((sc) => (
              <div
                key={sc.name}
                className="flex items-center justify-between gap-4 text-xs"
              >
                <span className="truncate min-w-0">{sc.name}</span>
                <div className="flex gap-3 shrink-0">
                  <span className="font-mono tabular-nums text-right w-14">
                    {formatCurrency(sc.mrr)}
                  </span>
                  <span className="font-mono tabular-nums text-right w-12 font-medium">
                    {formatMomentum(sc.momentum)}
                  </span>
                </div>
              </div>
            ))}
            {remaining > 0 && (
              <p className="text-xs text-muted-foreground">
                + {remaining} more
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-xl min-w-[200px]">
      <p className="text-sm font-medium">{data.name}</p>
      <div className="flex justify-between gap-6 mt-1.5">
        <span className="text-xs text-muted-foreground">MRR</span>
        <span className="text-xs font-mono tabular-nums text-right">
          {formatCurrency(data.value)}
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-xs text-muted-foreground">90-Day Movement</span>
        <span className="text-xs font-mono tabular-nums text-right font-medium">
          {formatMomentum(data.momentum)}
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-xs text-muted-foreground">Status</span>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${statusDot} inline-block`}
          />
          {getStatusLabel(data.status)}
        </span>
      </div>
    </div>
  )
}

const LEGEND_ITEMS = [
  { color: "bg-success", label: "Expanding" },
  { color: "bg-muted-foreground", label: "Flat (±2%)" },
  { color: "bg-destructive", label: "Contracting" },
]

export function RevenueMomentumTreemap({
  clients,
}: {
  clients: EnrichedClient[]
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const handleHover = useCallback((name: string | null) => {
    setHoveredNode(name)
  }, [])

  const treemapData = useMemo((): MomentumNode[] => {
    const active = clients.filter((c) => c.mrr > 0)
    if (active.length === 0) return []

    const withMomentum = active.map((c) => {
      const momentum = computeMomentum(c.clientMrrHistory)
      const status = getStatus(momentum)
      return { ...c, momentum, momentumStatus: status }
    })

    const sorted = withMomentum.sort((a, b) => b.mrr - a.mrr)
    const totalMrr = sorted.reduce((sum, c) => sum + c.mrr, 0)

    const splitIdx = sorted.findIndex(
      (c, i) => c.mrr / totalMrr < MIN_PCT || i >= MAX_BLOCKS
    )
    const cutoff = splitIdx === -1 ? sorted.length : splitIdx

    if (cutoff >= sorted.length) {
      return sorted.map((c) => ({
        name: c.name,
        value: c.mrr,
        momentum: c.momentum,
        status: c.momentumStatus,
        fill: getMomentumColor(c.momentumStatus),
      }))
    }

    const top: MomentumNode[] = sorted.slice(0, cutoff).map((c) => ({
      name: c.name,
      value: c.mrr,
      momentum: c.momentum,
      status: c.momentumStatus,
      fill: getMomentumColor(c.momentumStatus),
    }))

    const rest = sorted.slice(cutoff)
    const totalRestMrr = rest.reduce((sum, c) => sum + c.mrr, 0)
    const blendedMomentum =
      totalRestMrr > 0
        ? rest.reduce((sum, c) => sum + c.mrr * c.momentum, 0) / totalRestMrr
        : 0

    const statusBreakdown = rest.reduce<StatusBreakdown>(
      (acc, c) => {
        acc[c.momentumStatus]++
        return acc
      },
      { expanding: 0, flat: 0, contracting: 0 }
    )

    top.push({
      name: "All Other Clients",
      value: totalRestMrr,
      momentum: blendedMomentum,
      status: getStatus(blendedMomentum),
      fill: getMomentumColor(getStatus(blendedMomentum)),
      count: rest.length,
      statusBreakdown,
      subClients: rest.map((c) => ({
        name: c.name,
        mrr: c.mrr,
        momentum: c.momentum,
        status: c.momentumStatus,
      })),
    })

    return top
  }, [clients])

  if (treemapData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Revenue × Momentum Map
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <EmptyState 
            icon={Clock}
            title="Connect time tracking to see client health" 
            description="Integrate Toggl or Harvest to analyze client profitability."
            actionLabel="Connect Integration"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">
          Revenue × Momentum Map
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Size = MRR · Color = 90-day velocity
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <ChartContainer
          config={chartConfig}
          className="min-h-[260px] w-full aspect-auto"
        >
          <Treemap
            data={treemapData}
            dataKey="value"
            nameKey="name"
            type="flat"
            content={(props: TreemapNode) => (
              <CustomTreemapContent
                {...props}
                hoveredNode={hoveredNode}
                onHover={handleHover}
              />
            )}
            animationDuration={300}
          >
            <Tooltip
              content={<MomentumTooltipContent />}
              cursor={false}
            />
          </Treemap>
        </ChartContainer>
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          {LEGEND_ITEMS.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                <span
                  className={`w-2.5 h-2.5 rounded-sm ${item.color} inline-block`}
                />
              {item.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
