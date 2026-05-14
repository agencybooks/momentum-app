"use client"

import { useMemo } from "react"
import { Treemap, Tooltip } from "recharts"
import type { TreemapNode } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"
import type { EnrichedClient } from "@/lib/db/types"

interface SubClient {
  name: string
  mrr: number
  margin: number
}

interface HealthBreakdown {
  healthy: number
  watch: number
  critical: number
}

interface TreemapDataNode {
  name: string
  value: number
  margin: number
  fill: string
  subClients?: SubClient[]
  count?: number
  healthBreakdown?: HealthBreakdown
  [key: string]: unknown
}

const MIN_PCT = 0.03
const MAX_BLOCKS = 12
const PREVIEW_COUNT = 3

function getMarginColor(margin: number): string {
  if (margin >= 0.6) return "var(--success)"
  if (margin >= 0.3) return "var(--warning)"
  return "var(--destructive)"
}

function getMarginLabel(margin: number): string {
  if (margin >= 0.6) return "Healthy"
  if (margin >= 0.3) return "Watch"
  return "Critical"
}

const chartConfig = {
  mrr: { label: "MRR" },
} satisfies ChartConfig

function CustomTreemapContent(props: TreemapNode) {
  const { x, y, width, height, name } = props
  const margin = (props as Record<string, unknown>).margin as number
  const fill = (props as Record<string, unknown>).fill as string
  const isOther = !!(props as Record<string, unknown>).subClients

  const showFull = width > 80 && height > 36
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

  return (
    <g>
      {isOther && (
        <defs>
          <pattern
            id="other-hatch"
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
        style={{ fill, stroke: "var(--background)", strokeWidth: 2 }}
        className="transition-opacity hover:opacity-80"
      />
      {isOther && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          fill="url(#other-hatch)"
        />
      )}
      {showFull && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: "var(--background)", fontSize: 11, fontWeight: 500 }}
          >
            {truncatedName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fill: "var(--background)",
              fontSize: 10,
              fontWeight: 700,
              opacity: 0.9,
            }}
          >
            Margin: {(margin * 100).toFixed(0)}%
          </text>
        </>
      )}
      {showCompact && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: "var(--background)", fontSize: 9, fontWeight: 500, opacity: 0.85 }}
        >
          {compactName}
        </text>
      )}
    </g>
  )
}

function TreemapTooltipContent({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: Record<string, unknown> }>
}) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload as unknown as TreemapDataNode | undefined
  if (!data) return null

  if (data.subClients) {
    const preview = data.subClients.slice(0, PREVIEW_COUNT)
    const remaining = data.subClients.length - PREVIEW_COUNT
    const hb = data.healthBreakdown

    return (
      <div className="w-64 rounded-lg border border-border/50 bg-background px-3 py-2.5 shadow-xl">
        <p className="text-sm font-medium">
          All Other Clients ({data.count} accounts)
        </p>
        <div className="flex justify-between gap-6 mt-1">
          <span className="text-xs text-muted-foreground">Total MRR</span>
          <span className="text-xs font-mono tabular-nums text-right">
            {formatCurrency(data.value)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-xs text-muted-foreground">Blended Margin</span>
          <span className="text-xs font-mono tabular-nums text-right">
            {(data.margin * 100).toFixed(1)}%
          </span>
        </div>
        {hb && (
          <div className="flex items-center gap-3 mt-2 text-xs">
            {hb.healthy > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                {hb.healthy} Healthy
              </span>
            )}
            {hb.watch > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning inline-block" />
                {hb.watch} Watch
              </span>
            )}
            {hb.critical > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                {hb.critical} Critical
              </span>
            )}
          </div>
        )}
        {preview.length > 0 && (
          <div className="border-t border-border mt-2 pt-2 space-y-1">
            {preview.map((sc) => (
              <div key={sc.name} className="flex items-center justify-between gap-4 text-xs">
                <span className="truncate min-w-0">{sc.name}</span>
                <div className="flex gap-3 shrink-0">
                  <span className="font-mono tabular-nums text-right w-14">
                    {formatCurrency(sc.mrr)}
                  </span>
                  <span className="font-mono tabular-nums text-right w-10">
                    {(sc.margin * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
            {remaining > 0 && (
              <p className="text-xs text-muted-foreground">+ {remaining} more</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2.5 shadow-xl min-w-[200px]">
      <p className="text-sm font-medium">{data.name}</p>
      <div className="flex justify-between gap-6 mt-1">
        <span className="text-xs text-muted-foreground">MRR</span>
        <span className="text-xs font-mono tabular-nums text-right">
          {formatCurrency(data.value)}
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-xs text-muted-foreground">Margin</span>
        <span className="text-xs font-mono tabular-nums text-right">
          {(data.margin * 100).toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-xs text-muted-foreground">Health</span>
        <span className="text-xs font-medium">
          {getMarginLabel(data.margin)}
        </span>
      </div>
    </div>
  )
}

const LEGEND_ITEMS = [
  { color: "bg-success", label: ">60% Healthy" },
  { color: "bg-warning", label: "30–60% Watch" },
  { color: "bg-destructive", label: "<30% Critical" },
]

export function MarginTreemap({ clients }: { clients: EnrichedClient[] }) {
  const treemapData = useMemo((): TreemapDataNode[] => {
    const sorted = clients
      .filter((c) => c.mrr > 0)
      .sort((a, b) => b.mrr - a.mrr)

    if (sorted.length === 0) return []

    const totalMrr = sorted.reduce((sum, c) => sum + c.mrr, 0)

    const splitIdx = sorted.findIndex(
      (c, i) => c.mrr / totalMrr < MIN_PCT || i >= MAX_BLOCKS
    )

    const cutoff = splitIdx === -1 ? sorted.length : splitIdx

    if (cutoff >= sorted.length) {
      return sorted.map((c) => ({
        name: c.name,
        value: c.mrr,
        margin: c.margin,
        fill: getMarginColor(c.margin),
      }))
    }

    const top: TreemapDataNode[] = sorted.slice(0, cutoff).map((c) => ({
      name: c.name,
      value: c.mrr,
      margin: c.margin,
      fill: getMarginColor(c.margin),
    }))

    const rest = sorted.slice(cutoff)
    const totalRestMrr = rest.reduce((sum, c) => sum + c.mrr, 0)
    const weightedMargin =
      rest.reduce((sum, c) => sum + c.mrr * c.margin, 0) / totalRestMrr

    const healthBreakdown = rest.reduce<HealthBreakdown>(
      (acc, c) => {
        const label = getMarginLabel(c.margin)
        if (label === "Healthy") acc.healthy++
        else if (label === "Watch") acc.watch++
        else acc.critical++
        return acc
      },
      { healthy: 0, watch: 0, critical: 0 }
    )

    top.push({
      name: "All Other Clients",
      value: totalRestMrr,
      margin: weightedMargin,
      fill: getMarginColor(weightedMargin),
      count: rest.length,
      healthBreakdown,
      subClients: rest.map((c) => ({
        name: c.name,
        mrr: c.mrr,
        margin: c.margin,
      })),
    })

    return top
  }, [clients])

  if (treemapData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Revenue × Margin Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[260px]">
          <p className="text-sm text-muted-foreground">
            No active clients to display.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">
          Revenue × Margin Map
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Size = MRR · Color = margin health
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
            content={(props: TreemapNode) => <CustomTreemapContent {...props} />}
            animationDuration={300}
          >
            <Tooltip content={<TreemapTooltipContent />} />
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
