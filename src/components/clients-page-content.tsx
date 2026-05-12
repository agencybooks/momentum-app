"use client"

import { useState, useMemo } from "react"
import { useQueryState } from "nuqs"
import {
  Search,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientShockTest } from "@/components/client-shock-test"
import { MetricsGrid, type MetricWithDrawer } from "@/components/metrics-grid"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import type { ClientsPageData, EnrichedClient } from "@/lib/db/types"

type SortField = "runwayImpact" | "mrr" | "marginLTV" | "name"
type SortDir = "asc" | "desc"
type FilterKey = "all" | "active" | "at-risk" | "churned"

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

function formatCurrency(val: number): string {
  if (val === 0) return "$0"
  const abs = Math.abs(val)
  if (abs >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `$${(val / 1000).toFixed(1)}K`
  return `$${val.toLocaleString()}`
}

function formatCurrencyFull(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val)
}

export function ClientsPageContent({ data }: { data: ClientsPageData }) {
  const [, setDrawer] = useQueryState("drawer")
  const [, setClientId] = useQueryState("clientId")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: "runwayImpact",
    dir: "desc",
  })
  const [concentrationView, setConcentrationView] = useState<"revenue" | "grossProfit">("revenue")

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
        case "runwayImpact":
          return (a.runwayImpact - b.runwayImpact) * dir
        case "mrr":
          return (a.mrr - b.mrr) * dir
        case "marginLTV":
          return (a.marginLTV - b.marginLTV) * dir
        case "name":
          return a.name.localeCompare(b.name) * dir
        default:
          return 0
      }
    })
  }, [data.clients, activeFilter, searchQuery, sort])

  // --- KPI Strip ---
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
      id: "clients-churn",
      title: "Gross MRR Churn",
      value: `${data.grossMrrChurn.toFixed(1)}%`,
      target: "< 5%",
      trendText: `${data.grossMrrChurn.toFixed(1)}% of prior MRR`,
      trendUp: data.grossMrrChurn > 2,
      trendDirection: "down-is-good",
      isHealthy: data.grossMrrChurn < 5,
      drawerId: "clients-churn",
    },
    {
      id: "clients-concentration",
      title: "Top Client Concentration",
      value: `${data.topClientConcentration.toFixed(0)}%`,
      target: "< 25%",
      trendText: `${data.topClientConcentration >= 25 ? "At" : "Below"} 25% ceiling`,
      trendUp: data.topClientConcentration >= 25,
      trendDirection: "down-is-good",
      isHealthy: data.topClientConcentration < 25,
      drawerId: "clients-concentration",
    },
    {
      id: "clients-margin-ltv",
      title: "Avg Margin LTV",
      value: formatCurrency(data.avgMarginLTV),
      trendText: "Revenue-weighted average",
      trendUp: true,
      trendDirection: "up-is-good",
      isHealthy: true,
      drawerId: "clients-margin-ltv",
    },
  ]

  // --- Concentration bar segments ---
  const concentrationClients = useMemo(() => {
    const active = data.clients.filter((c) => c.mrr > 0).sort((a, b) => {
      if (concentrationView === "revenue") return b.mrr - a.mrr
      return b.grossProfit - a.grossProfit
    })
    const total = active.reduce(
      (sum, c) => sum + (concentrationView === "revenue" ? c.mrr : c.grossProfit),
      0
    )
    const top4 = active.slice(0, 4)
    const othersValue = active.slice(4).reduce(
      (sum, c) => sum + (concentrationView === "revenue" ? c.mrr : c.grossProfit),
      0
    )
    const barClasses = [
      "bg-brand-500",
      "bg-brand-500/80",
      "bg-brand-500/60",
      "bg-brand-500/40",
    ]
    const segments = top4.map((c, i) => {
      const val = concentrationView === "revenue" ? c.mrr : c.grossProfit
      return {
        name: c.name,
        pct: total > 0 ? (val / total) * 100 : 0,
        barClass: barClasses[i],
      }
    })
    if (othersValue > 0) {
      segments.push({
        name: "Others",
        pct: total > 0 ? (othersValue / total) * 100 : 0,
        barClass: "",
      })
    }
    return { segments, total }
  }, [data.clients, concentrationView])

  // --- Churn waterfall max ---
  const waterfallMax = useMemo(() => {
    return Math.max(...data.mrrHistory.map((m) => Math.max(m.gains, Math.abs(m.losses))), 1)
  }, [data.mrrHistory])

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
        subtitle="Revenue risks, concentration limits, and tactical client roster."
      />

      {/* Zone 1: CoPilot Alert */}
      {data.alert && (
        <CoPilotAlert
          title={data.alert.title}
          message={data.alert.message}
          type={data.alert.type}
        />
      )}

      {/* Row 1: KPI Strip */}
      <MetricsGrid metrics={metrics} columns={4} />

      {/* Row 2: Risk Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Concentration Risk Widget */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Concentration Risk</CardTitle>
              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setConcentrationView("revenue")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    concentrationView === "revenue"
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:bg-accent"
                  )}
                >
                  Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setConcentrationView("grossProfit")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    concentrationView === "grossProfit"
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:bg-accent"
                  )}
                >
                  Gross Profit
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="w-full h-10 flex rounded-lg border border-border overflow-hidden shadow-inner">
              {concentrationClients.segments.map((seg) =>
                !seg.barClass ? (
                  <div
                    key={seg.name}
                    className="h-full bg-muted dark:bg-zinc-800 flex-1"
                    title={`${seg.name}: ${seg.pct.toFixed(0)}%`}
                  />
                ) : (
                  <div
                    key={seg.name}
                    className={cn("h-full border-r border-background/20", seg.barClass)}
                    style={{ width: `${seg.pct}%` }}
                    title={`${seg.name}: ${seg.pct.toFixed(0)}%`}
                  />
                )
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Total: {formatCurrency(concentrationClients.total)} across{" "}
                {data.clients.filter((c) => c.mrr > 0).length} clients
              </span>
              <div className="flex gap-3">
                {concentrationClients.segments.slice(0, 3).map((seg) => (
                  <span key={seg.name} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{seg.pct.toFixed(0)}%</span>{" "}
                    {seg.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Churn Waterfall Widget */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Net Revenue Impact (90d)</CardTitle>
              <button
                type="button"
                onClick={() => setDrawer("clients-churn-waterfall")}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                View detail →
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.mrrHistory.map((month) => {
              const net = month.gains + month.losses
              return (
                <div key={month.month} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground w-16">{month.month}</span>
                    <span
                      className={cn(
                        "text-xs font-bold tabular-nums",
                        net >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {net >= 0 ? "+" : ""}
                      {formatCurrency(net)}
                    </span>
                  </div>
                  <div className="flex gap-1 h-5">
                    {month.gains > 0 && (
                      <div
                        className="h-full rounded-sm bg-brand-500/20 border border-brand-500/30 transition-all"
                        style={{ width: `${(month.gains / waterfallMax) * 100}%` }}
                        title={`Gains: +${formatCurrency(month.gains)} — ${month.details
                          .filter((d) => d.amount > 0)
                          .map((d) => `${d.name}: +${formatCurrency(d.amount)}`)
                          .join(", ")}`}
                      />
                    )}
                    {month.losses < 0 && (
                      <div
                        className="h-full rounded-sm bg-destructive/20 border border-destructive/30 transition-all"
                        style={{ width: `${(Math.abs(month.losses) / waterfallMax) * 100}%` }}
                        title={`Losses: ${formatCurrency(month.losses)} — ${month.details
                          .filter((d) => d.amount < 0)
                          .map((d) => `${d.name}: ${formatCurrency(d.amount)}`)
                          .join(", ")}`}
                      />
                    )}
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-2 rounded-sm bg-brand-500/20 border border-brand-500/30 inline-block" />
                Gains
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-2 rounded-sm bg-destructive/20 border border-destructive/30 inline-block" />
                Losses
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Tactical Roster Table */}
      <Card>
        <CardHeader className="pb-4">
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
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortableHead
                    field="name"
                    label="Client"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[28%]"
                  />
                  <SortableHead
                    field="mrr"
                    label="Current MRR"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[15%] text-right"
                    align="right"
                  />
                  <SortableHead
                    field="marginLTV"
                    label="Margin LTV"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[20%] text-right"
                    align="right"
                  />
                  <SortableHead
                    field="runwayImpact"
                    label="Runway Impact"
                    currentSort={sort}
                    onSort={toggleSort}
                    className="w-[17%] text-right"
                    align="right"
                  />
                  <TableHead className="w-[20%] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">
                    Risk Signals
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    isExpanded={expandedClient === client.id}
                    onToggle={() =>
                      setExpandedClient((prev) =>
                        prev === client.id ? null : client.id
                      )
                    }
                    onNameClick={() => {
                      setClientId(client.id)
                      setDrawer("client-ledger")
                    }}
                  />
                ))}
                {sortedClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No clients match your filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Row 4: Cohort Margin View */}
      {data.cohortMargins.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Client Margin by Acquisition Cohort</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.cohortMargins.map((cohort, i) => {
              const maxMargin = Math.max(...data.cohortMargins.map((c) => c.avgMargin))
              const barWidth = maxMargin > 0 ? (cohort.avgMargin / maxMargin) * 100 : 0
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
                  <span className="text-sm font-bold tabular-nums text-foreground w-14 text-right">
                    {(cohort.avgMargin * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {cohort.clientCount} client{cohort.clientCount !== 1 ? "s" : ""}
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
        "text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 cursor-pointer select-none hover:text-foreground transition-colors",
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

function ClientRow({
  client,
  isExpanded,
  onToggle,
  onNameClick,
}: {
  client: EnrichedClient
  isExpanded: boolean
  onToggle: () => void
  onNameClick: () => void
}) {
  const Chevron = isExpanded ? ChevronDown : ChevronRight
  const statusCfg = STATUS_CONFIG[client.displayStatus]

  return (
    <>
      <TableRow
        className={cn(
          "group cursor-pointer transition-colors hover:bg-muted/50",
          isExpanded && "border-b-0"
        )}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            <Chevron className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full shrink-0", statusCfg.dot)} />
              <button
                type="button"
                className="font-medium text-foreground hover:text-brand-600 dark:hover:text-brand-400 hover:underline text-left"
                onClick={(e) => {
                  e.stopPropagation()
                  onNameClick()
                }}
              >
                {client.name}
              </button>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span className="tabular-nums font-medium font-mono">
            {client.mrr > 0 ? formatCurrencyFull(client.mrr) : "—"}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex flex-col items-end">
            <span className="tabular-nums font-bold font-mono">
              {client.marginLTV > 0 ? formatCurrency(client.marginLTV) : "—"}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {client.tenure_months > 0
                ? `${(client.tenure_months / 12).toFixed(1)} yrs`
                : "—"}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span
            className={cn(
              "tabular-nums font-medium font-mono",
              client.runwayImpact >= 1
                ? "text-destructive"
                : client.runwayImpact >= 0.5
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-muted-foreground"
            )}
          >
            {client.runwayImpact > 0
              ? `-${client.runwayImpact.toFixed(1)} mo`
              : "—"}
          </span>
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

      {isExpanded && client.shockTest && (
        <TableRow className="hover:bg-transparent border-b border-border">
          <TableCell colSpan={5} className="p-0">
            <ClientShockTest
              clientName={client.name}
              revenueImpact={client.shockTest.revenueImpact}
              annualizedImpact={client.shockTest.annualizedImpact}
              runwayBefore={client.shockTest.runwayBefore}
              runwayAfter={client.shockTest.runwayAfter}
              runwayDelta={client.shockTest.runwayDelta}
              newTopClient={client.shockTest.newTopClient}
              newTopClientPct={client.shockTest.newTopClientPct}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
