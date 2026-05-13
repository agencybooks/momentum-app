"use client"

import { useState, useMemo, useEffect } from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { MetricsGrid, type MetricWithDrawer } from "@/components/metrics-grid"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { PageHeader } from "@/components/page-header"
import { ClientHealthMatrix } from "@/components/client-health-matrix"
import { NrrMoversList } from "@/components/nrr-movers-list"
import { ConcentrationRiskWidget } from "@/components/concentration-risk-widget"
import { cn } from "@/lib/utils"
import { formatCurrency, formatCurrencyFull } from "@/lib/format"
import { LockedMarginCell } from "@/components/locked-margin-cell"
import type { ClientsPageData, EnrichedClient } from "@/lib/db/types"

type SortField = "name" | "mrr" | "grossMarginPct" | "netProfit"
type SortDir = "asc" | "desc"
type FilterKey = "all" | "active" | "at-risk" | "churned"

const PAGE_SIZE = 10

const FILTER_MAP: Record<FilterKey, (c: EnrichedClient) => boolean> = {
  all: () => true,
  active: (c) => c.displayStatus === "Active",
  "at-risk": (c) => c.displayStatus === "At Risk",
  churned: (c) => c.displayStatus === "Churned",
}

const STATUS_CONFIG = {
  Active: { dot: "bg-emerald-500", text: "text-sm" },
  "At Risk": {
    dot: "bg-amber-500",
    text: "text-sm text-amber-600 dark:text-amber-500 font-medium",
  },
  Churned: { dot: "bg-zinc-400", text: "text-sm text-muted-foreground" },
} as const

export function ClientsPageContent({ data }: { data: ClientsPageData }) {
  const [, setDrawer] = useQueryState("drawer")
  const [, setClientId] = useQueryState("clientId")
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: "grossMarginPct",
    dir: "asc",
  })
  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "desc" ? "asc" : "desc" }
        : { field, dir: "desc" }
    )
  }

  const filterCounts: Record<FilterKey, number> = {
    all: data.clients.length,
    active: data.clients.filter(FILTER_MAP.active).length,
    "at-risk": data.clients.filter(FILTER_MAP["at-risk"]).length,
    churned: data.clients.filter(FILTER_MAP.churned).length,
  }

  const sortedClients = useMemo(() => {
    const filtered = data.clients
      .filter(FILTER_MAP[activeFilter])
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return [...filtered].sort((a, b) => {
      const dir = sort.dir === "desc" ? -1 : 1
      switch (sort.field) {
        case "grossMarginPct":
          return (a.margin - b.margin) * dir
        case "netProfit":
          return (a.unitEconomics.netClientProfit - b.unitEconomics.netClientProfit) * dir
        case "mrr":
          return (a.mrr - b.mrr) * dir
        case "name":
          return a.name.localeCompare(b.name) * dir
        default:
          return 0
      }
    })
  }, [data.clients, activeFilter, searchQuery, sort])

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const paginatedClients = sortedClients.slice(startIndex, startIndex + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [activeFilter, searchQuery, setPage])

  // --- KPI Strip ---
  const CONCENTRATION_CEILING = 20

  const metrics: MetricWithDrawer[] = [
    {
      id: "clients-nrr",
      title: "Net Revenue Retention",
      value: `${data.nrr.toFixed(1)}%`,
      target: "100%",
      trendText: `${data.nrr >= 100 ? "+" : ""}${(data.nrr - 100).toFixed(1)}pp vs baseline`,
      trendUp: data.nrr > 100,
      trendDirection: "up-is-good",
      isHealthy: data.nrr >= 100,
      drawerId: "clients-nrr",
    },
    {
      id: "clients-total-mrr",
      title: "Total Active MRR",
      value: formatCurrency(data.totalMrr),
      trendText: "+3.8% vs prior",
      trendUp: true,
      trendDirection: "up-is-good",
      isHealthy: true,
      drawerId: "clients-total-mrr",
    },
    {
      id: "clients-blended-margin",
      title: "Blended Gross Margin",
      value: `${(data.blendedGrossMargin * 100).toFixed(1)}%`,
      target: "50%",
      trendText: `${data.blendedGrossMargin >= 0.50 ? "+" : ""}${((data.blendedGrossMargin - 0.50) * 100).toFixed(1)}pp vs target`,
      trendUp: data.blendedGrossMargin > 0.50,
      trendDirection: "up-is-good",
      isHealthy: data.blendedGrossMargin >= 0.50,
      drawerId: "clients-blended-margin",
    },
    {
      id: "clients-rev-concentration",
      title: "Revenue Concentration",
      value: `${data.topClientConcentration.toFixed(0)}%`,
      target: `< ${CONCENTRATION_CEILING}%`,
      trendText: `${data.topClientConcentration >= CONCENTRATION_CEILING ? "Above" : "Below"} ${CONCENTRATION_CEILING}% ceiling`,
      trendUp: data.topClientConcentration >= CONCENTRATION_CEILING,
      trendDirection: "down-is-good",
      isHealthy: data.topClientConcentration < CONCENTRATION_CEILING,
      drawerId: "clients-rev-concentration",
    },
    {
      id: "clients-profit-concentration",
      title: "Profit Concentration",
      value: `${data.topClientProfitConcentration.toFixed(0)}%`,
      trendText: `Top client: ${data.topClientProfitConcentration.toFixed(0)}% of profit`,
      trendUp: data.topClientProfitConcentration > CONCENTRATION_CEILING,
      trendDirection: "down-is-good",
      isHealthy: data.topClientProfitConcentration < CONCENTRATION_CEILING + 10,
      drawerId: "clients-profit-concentration",
    },
  ]

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "at-risk", label: "At Risk" },
    { key: "churned", label: "Churned" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Clients"
        subtitle="Client profitability diagnostics, margin analysis, and risk signals."
        actions={
          data.alert ? (
            <CoPilotAlert
              title={data.alert.title}
              message={data.alert.message}
              type={data.alert.type}
            />
          ) : undefined
        }
      />

      {/* Row 1: KPI Strip */}
      <MetricsGrid metrics={metrics} columns={5} />

      {/* Row 2: Concentration Risk */}
      <ConcentrationRiskWidget
        clients={data.clients}
        totalMrr={data.totalMrr}
      />

      {/* Row 3: Client Risk Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientHealthMatrix clients={data.clients} />
        <NrrMoversList clients={data.clients} />
      </div>

      {/* Row 4: Tactical Roster Table */}
      <Card className="min-h-[600px]">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <Badge
                  key={f.key}
                  variant="outline"
                  className={cn(
                    "cursor-pointer select-none",
                    activeFilter === f.key
                      ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent"
                  )}
                  render={
                    <button
                      type="button"
                      onClick={() => setActiveFilter(f.key)}
                    />
                  }
                >
                  {f.label} {filterCounts[f.key]}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[7%] text-sm font-medium text-muted-foreground border-b bg-transparent text-center">
                    Rank
                  </TableHead>
                  <SortableHead
                    field="name"
                    label="Client"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[21%]"
                  />
                  <SortableHead
                    field="mrr"
                    label="Current MRR"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[13%] text-right"
                    align="right"
                  />
                  <SortableHead
                    field="grossMarginPct"
                    label="Gross Margin %"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[12%] text-right"
                    align="right"
                  />
                  <SortableHead
                    field="netProfit"
                    label="Monthly Net Profit"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[15%] text-right"
                    align="right"
                  />
                  <TableHead className="w-[12%] text-sm font-medium text-muted-foreground border-b bg-transparent text-center">
                    90-Day Trend
                  </TableHead>
                  <TableHead className="w-[20%] text-sm font-medium text-muted-foreground border-b bg-transparent">
                    Risk Signals
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    onRowClick={() => {
                      setClientId(client.id)
                      setDrawer("client-profile")
                    }}
                  />
                ))}
                {sortedClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-[400px] text-center align-middle text-muted-foreground">
                      No clients match your filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex-1" />
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground tabular-nums">
              {sortedClients.length === 0
                ? "No results"
                : `Showing ${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, sortedClients.length)} of ${sortedClients.length}`}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>

      {/* Row 4: Retained MRR by Cohort */}
      {data.cohortRetainedMrr.length > 0 && (
        <Card>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-medium text-foreground tracking-tight">Retained MRR by Cohort</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.cohortRetainedMrr.map((cohort, i) => {
              const maxRetainedMrr = Math.max(...data.cohortRetainedMrr.map((c) => c.retainedMrr))
              const barWidth = maxRetainedMrr > 0 ? (cohort.retainedMrr / maxRetainedMrr) * 100 : 0
              const cohortBarClasses = ["bg-brand-500/40", "bg-brand-500/60", "bg-brand-500/80", "bg-brand-500"]
              const barClass = cohortBarClasses[Math.min(i, cohortBarClasses.length - 1)]
              return (
                <div key={cohort.year} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-12 shrink-0 tabular-nums">
                    {cohort.year}
                  </span>
                  <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                    <div
                      className={cn("h-full rounded transition-all", barClass)}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground w-24 text-right font-mono">
                    {formatCurrencyFull(cohort.retainedMrr)}
                  </span>
                  <span className="text-xs text-muted-foreground w-24 text-right">
                    {cohort.activeClientCount} active client{cohort.activeClientCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// --- Sub-components ---

function SortableHead({
  field,
  label,
  currentSort,
  onSort,
  className,
  align,
}: {
  field: SortField
  label: string
  currentSort: { field: SortField; dir: SortDir }
  onSort: (field: SortField) => void
  className?: string
  align?: "right"
}) {
  const isActive = currentSort.field === field
  const Icon = isActive
    ? currentSort.dir === "desc"
      ? ArrowDown
      : ArrowUp
    : ArrowUpDown

  return (
    <TableHead
      className={cn(
        "text-sm font-medium text-muted-foreground border-b bg-transparent cursor-pointer select-none hover:text-foreground transition-colors",
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className={cn("flex items-center gap-1", align === "right" && "justify-end")}>
        {label}
        <Icon className={cn("w-3 h-3", isActive ? "text-foreground" : "text-muted-foreground/50")} />
      </div>
    </TableHead>
  )
}

function MarginSparkline({ data, clientId }: { data: { month: string; margin: number }[]; clientId: string }) {
  const isDecline = data.length >= 2 && data[data.length - 1].margin < data[0].margin
  const color = isDecline ? "var(--color-destructive)" : "var(--color-success)"
  const gradientId = `margin-spark-${clientId}`
  const chartData = data.map(d => ({ month: d.month, value: d.margin * 100 }))
  const config = { value: { label: "Margin", color } } satisfies ChartConfig

  return (
    <div className="w-full h-6 mx-auto max-w-[80px]">
      <ChartContainer config={config} className="w-full h-full !aspect-auto">
        <AreaChart data={chartData} margin={{ top: 1, right: 0, left: 0, bottom: 1 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fillOpacity={0.6}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function ClientRow({
  client,
  onRowClick,
}: {
  client: EnrichedClient
  onRowClick: () => void
}) {
  const statusCfg = STATUS_CONFIG[client.displayStatus]

  return (
    <TableRow
      className="group cursor-pointer transition-colors hover:bg-muted/50"
      onClick={onRowClick}
    >
      <TableCell className="text-center">
        <span className="font-mono text-sm text-muted-foreground tabular-nums">
          {client.profitRank > 0 ? `#${client.profitRank}` : "—"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full shrink-0", statusCfg.dot)} />
          <span className="font-medium text-foreground">{client.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className="tabular-nums font-medium font-mono">
          {client.mrr > 0 ? formatCurrencyFull(client.mrr) : "—"}
        </span>
      </TableCell>
      <LockedMarginCell
        margin={client.margin}
        mrr={client.mrr}
        hasTimeTracking={client.hasTimeTracking}
      />
      <TableCell className="text-right">
        <span
          className={cn(
            "tabular-nums font-medium font-mono",
            client.unitEconomics.netClientProfit < 0 ? "text-destructive" : "text-foreground"
          )}
        >
          {client.mrr > 0 ? formatCurrencyFull(client.unitEconomics.netClientProfit) : "—"}
        </span>
      </TableCell>
      <TableCell className="text-center">
        {client.marginTrend90d.length > 0 ? (
          <MarginSparkline data={client.marginTrend90d} clientId={client.id} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        {client.riskTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {client.riskTags.map((tag) => (
              <Badge
                key={tag.label}
                variant="outline"
                className={cn(
                  "font-normal shadow-none text-xs",
                  tag.variant === "amber"
                    ? "bg-amber-500/5 text-amber-600 dark:text-amber-500 border-amber-500/20"
                    : "bg-destructive/5 text-destructive dark:text-red-400 border-destructive/20"
                )}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}
