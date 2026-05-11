"use client"

import { useState, Fragment } from "react"
import { Search, ChevronRight, ChevronDown, Activity, AlertTriangle, CheckCircle2, Users, UserPlus, UserMinus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClientShockTest } from "@/components/client-shock-test"
import { cn } from "@/lib/utils"

interface ClientRowData {
  id: string
  name: string
  status: "Active" | "At Risk" | "Churned"
  revenue90d: string
  margin: string
  tenure: string
  openAr: string
  riskSignals: { label: string; variant: "amber" | "destructive" }[]
  shockTest?: {
    revenueImpact: string
    annualizedImpact: string
    runwayBefore: string
    runwayAfter: string
    runwayDelta: string
    newTopClient: string
    newTopClientPct: string
  }
}

const CLIENTS: ClientRowData[] = [
  {
    id: "acme",
    name: "Acme Co.",
    status: "Active",
    revenue90d: "$84.0K",
    margin: "42%",
    tenure: "51 mo",
    openAr: "$76.0K",
    riskSignals: [{ label: "Concentration", variant: "amber" }],
    shockTest: {
      revenueImpact: "-$28.0K",
      annualizedImpact: "-$336.0K annualized",
      runwayBefore: "5.4",
      runwayAfter: "4.1",
      runwayDelta: "-1.3 mo runway",
      newTopClient: "Brightline SaaS",
      newTopClientPct: "Would hold 31% of revenue",
    },
  },
  {
    id: "cobalt",
    name: "Cobalt Outdoor",
    status: "At Risk",
    revenue90d: "$25.0K",
    margin: "28%",
    tenure: "28 mo",
    openAr: "$25.0K",
    riskSignals: [
      { label: "Slow Pay", variant: "destructive" },
      { label: "Declining Rev", variant: "destructive" },
    ],
    shockTest: {
      revenueImpact: "-$8.3K",
      annualizedImpact: "-$99.6K annualized",
      runwayBefore: "5.4",
      runwayAfter: "5.0",
      runwayDelta: "-0.4 mo runway",
      newTopClient: "Acme Co.",
      newTopClientPct: "Would hold 27% of revenue",
    },
  },
  {
    id: "brightline",
    name: "Brightline SaaS",
    status: "Active",
    revenue90d: "$62.0K",
    margin: "51%",
    tenure: "35 mo",
    openAr: "$12.0K",
    riskSignals: [],
    shockTest: {
      revenueImpact: "-$20.7K",
      annualizedImpact: "-$248.0K annualized",
      runwayBefore: "5.4",
      runwayAfter: "4.4",
      runwayDelta: "-1.0 mo runway",
      newTopClient: "Acme Co.",
      newTopClientPct: "Would hold 33% of revenue",
    },
  },
  {
    id: "meridian",
    name: "Meridian Health",
    status: "Active",
    revenue90d: "$41.0K",
    margin: "38%",
    tenure: "22 mo",
    openAr: "$8.5K",
    riskSignals: [],
    shockTest: {
      revenueImpact: "-$13.7K",
      annualizedImpact: "-$164.0K annualized",
      runwayBefore: "5.4",
      runwayAfter: "4.8",
      runwayDelta: "-0.6 mo runway",
      newTopClient: "Acme Co.",
      newTopClientPct: "Would hold 28% of revenue",
    },
  },
  {
    id: "nova",
    name: "Nova Digital",
    status: "Active",
    revenue90d: "$33.0K",
    margin: "45%",
    tenure: "18 mo",
    openAr: "$6.0K",
    riskSignals: [],
    shockTest: {
      revenueImpact: "-$11.0K",
      annualizedImpact: "-$132.0K annualized",
      runwayBefore: "5.4",
      runwayAfter: "4.9",
      runwayDelta: "-0.5 mo runway",
      newTopClient: "Acme Co.",
      newTopClientPct: "Would hold 28% of revenue",
    },
  },
  {
    id: "pinnacle",
    name: "Pinnacle Media",
    status: "Active",
    revenue90d: "$28.0K",
    margin: "36%",
    tenure: "14 mo",
    openAr: "$4.2K",
    riskSignals: [],
  },
  {
    id: "summit",
    name: "Summit Labs",
    status: "Active",
    revenue90d: "$19.0K",
    margin: "52%",
    tenure: "41 mo",
    openAr: "$3.1K",
    riskSignals: [],
  },
  {
    id: "ironclad",
    name: "Ironclad Legal",
    status: "Active",
    revenue90d: "$15.0K",
    margin: "44%",
    tenure: "9 mo",
    openAr: "$2.8K",
    riskSignals: [],
  },
  {
    id: "catalyst",
    name: "Catalyst Ventures",
    status: "Active",
    revenue90d: "$11.0K",
    margin: "39%",
    tenure: "6 mo",
    openAr: "$1.5K",
    riskSignals: [],
  },
  {
    id: "redwood",
    name: "Redwood Analytics",
    status: "Churned",
    revenue90d: "$0",
    margin: "—",
    tenure: "12 mo",
    openAr: "$0",
    riskSignals: [],
  },
]

interface RetentionEntry {
  name: string
  amount: string
}

interface RetentionMonth {
  id: string
  label: string
  active: number
  newCount: number
  lostCount: number
  churnPct: string
  netRevImpact: string
  gainsTotal: string
  lossesTotal: string
  gains: RetentionEntry[]
  losses: RetentionEntry[]
}

const RETENTION_MONTHS: RetentionMonth[] = [
  {
    id: "mar-26",
    label: "Mar '26",
    active: 136,
    newCount: 5,
    lostCount: 2,
    churnPct: "1.5%",
    netRevImpact: "+$2,194",
    gainsTotal: "+$8,987",
    lossesTotal: "-$6,793",
    gains: [
      { name: "Lumen Studio", amount: "+$3,990" },
      { name: "Nova Digital", amount: "+$2,059" },
      { name: "Evergreen Wellness", amount: "+$1,013" },
      { name: "Apex Startups", amount: "+$966" },
      { name: "Vanguard Tech", amount: "+$959" },
    ],
    losses: [
      { name: "Greenline Logistics", amount: "-$4,670" },
      { name: "BlueShift Media", amount: "-$2,123" },
    ],
  },
  {
    id: "feb-26",
    label: "Feb '26",
    active: 133,
    newCount: 4,
    lostCount: 2,
    churnPct: "1.5%",
    netRevImpact: "+$1,158",
    gainsTotal: "+$6,890",
    lossesTotal: "-$4,732",
    gains: [
      { name: "Catalyst Ventures", amount: "+$2,840" },
      { name: "Ironclad Legal", amount: "+$1,950" },
      { name: "Summit Labs", amount: "+$1,210" },
      { name: "Redwood Analytics", amount: "+$890" },
    ],
    losses: [
      { name: "Helios Energy", amount: "-$3,412" },
      { name: "Coastal Freight", amount: "-$1,320" },
    ],
  },
]

const STATUS_CONFIG = {
  Active: { dot: "bg-emerald-500", text: "text-sm" },
  "At Risk": {
    dot: "bg-amber-500",
    text: "text-sm text-amber-600 dark:text-amber-500 font-medium",
  },
  Churned: { dot: "bg-zinc-400", text: "text-sm text-muted-foreground" },
} as const

type FilterKey = "all" | "active" | "at-risk" | "churned"

const FILTER_MAP: Record<FilterKey, (c: ClientRowData) => boolean> = {
  all: () => true,
  active: (c) => c.status === "Active",
  "at-risk": (c) => c.status === "At Risk",
  churned: (c) => c.status === "Churned",
}

export default function ClientsPage() {
  const [expandedClient, setExpandedClient] = useState<string | null>("acme")
  const [expandedMonth, setExpandedMonth] = useState<string | null>("mar-26")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleClient = (id: string) => {
    setExpandedClient((prev) => (prev === id ? null : id))
  }
  const toggleMonth = (id: string) => {
    setExpandedMonth((prev) => (prev === id ? null : id))
  }

  const filterCounts: Record<FilterKey, number> = {
    all: CLIENTS.length,
    active: CLIENTS.filter(FILTER_MAP.active).length,
    "at-risk": CLIENTS.filter(FILTER_MAP["at-risk"]).length,
    churned: CLIENTS.filter(FILTER_MAP.churned).length,
  }

  const filteredClients = CLIENTS.filter(FILTER_MAP[activeFilter]).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "at-risk", label: "At Risk" },
    { key: "churned", label: "Churned" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your roster, concentration, and retention.
        </p>
      </div>

      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 rounded-none gap-6 h-auto">
          <TabsTrigger
            value="roster"
            className="relative rounded-none border-0 border-b-2 border-b-transparent !shadow-none bg-transparent data-active:!bg-transparent px-1 py-3 font-medium text-muted-foreground hover:text-foreground data-active:!border-b-brand-500 data-active:text-foreground transition-none focus-visible:ring-0 focus-visible:outline-none"
          >
            Roster
          </TabsTrigger>
          <TabsTrigger
            value="concentration"
            className="relative rounded-none border-0 border-b-2 border-b-transparent !shadow-none bg-transparent data-active:!bg-transparent px-1 py-3 font-medium text-muted-foreground hover:text-foreground data-active:!border-b-brand-500 data-active:text-foreground transition-none focus-visible:ring-0 focus-visible:outline-none"
          >
            Concentration
          </TabsTrigger>
          <TabsTrigger
            value="retention"
            className="relative rounded-none border-0 border-b-2 border-b-transparent !shadow-none bg-transparent data-active:!bg-transparent px-1 py-3 font-medium text-muted-foreground hover:text-foreground data-active:!border-b-brand-500 data-active:text-foreground transition-none focus-visible:ring-0 focus-visible:outline-none"
          >
            Retention
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          {/* Command Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border shadow-sm"
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

          {/* Data Grid */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%] sm:w-auto text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">
                    Client
                  </TableHead>
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">
                    Status
                  </TableHead>
                  <TableHead className="w-[140px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">
                    90D Revenue
                  </TableHead>
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">
                    Margin
                  </TableHead>
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">
                    Tenure
                  </TableHead>
                  <TableHead className="w-[120px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">
                    Open AR
                  </TableHead>
                  <TableHead className="w-[200px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">
                    Risk Signals
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const isExpanded = expandedClient === client.id
                  const statusCfg = STATUS_CONFIG[client.status]

                  return (
                    <ClientRow
                      key={client.id}
                      client={client}
                      isExpanded={isExpanded}
                      statusConfig={statusCfg}
                      onToggle={() => toggleClient(client.id)}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="concentration">
          <div className="flex flex-col gap-8 mt-6 outline-none">
            {/* Insight Banner */}
            <div className="bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 flex items-center gap-3">
              <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">Acme Co. represents 25% of trailing 90-day revenue — right on your 25% ceiling. Top 5 cover 76%.</span>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between h-32">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Client</span>
                <span className="text-3xl font-bold tabular-nums mt-2">25.0%</span>
                <span className="text-xs text-muted-foreground mt-auto">Acme Co.</span>
              </div>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between h-32">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top 3 Clients</span>
                <span className="text-3xl font-bold tabular-nums mt-2">60.8%</span>
                <span className="text-xs text-muted-foreground mt-auto truncate">Acme Co, Brightline, Dunwoody</span>
              </div>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between h-32">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top 5 Clients</span>
                <span className="text-3xl font-bold tabular-nums mt-2">76.3%</span>
                <span className="text-xs text-muted-foreground mt-auto truncate">Acme, Brightline, Dunwoody, Foundry, Cobalt</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Trailing 90-day revenue by client</h3>
              <div className="w-full h-10 flex rounded-lg border border-border overflow-hidden shadow-inner">
                <div className="h-full bg-brand-500 border-r border-background/20" style={{ width: '25%' }} title="Acme Co: 25%" />
                <div className="h-full bg-brand-500/80 border-r border-background/20" style={{ width: '21%' }} title="Brightline: 21%" />
                <div className="h-full bg-brand-500/60 border-r border-background/20" style={{ width: '15%' }} title="Dunwoody: 15%" />
                <div className="h-full bg-brand-500/40 border-r border-background/20" style={{ width: '15%' }} title="Foundry: 15%" />
                <div className="flex-1 h-full bg-muted dark:bg-zinc-800" title="Others: 24%" />
              </div>
              <span className="text-xs text-muted-foreground mt-2 block">Total: $335.5K across 10 clients</span>
            </div>

            {/* Action Alert */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mt-4 mb-4">What&apos;s worth your attention</h3>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm max-w-2xl flex flex-col gap-3">
                <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 shadow-none">
                  <AlertTriangle className="w-3 h-3 mr-2 inline" /> Warning
                </Badge>
                <span className="font-semibold text-foreground">Top client concentration at ceiling</span>
                <span className="text-sm text-muted-foreground leading-relaxed">Acme Co. represents 25% of trailing 90-day revenue, sitting right on your 25% concentration ceiling. Any growth at Acme&apos;s scale tips you into breach.</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="retention">
          <div className="flex flex-col gap-8 mt-6 outline-none">
            {/* Insight Banner */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Quiet last 12 months overall — 1.5% average monthly churn, well under your 5% threshold.</span>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4 text-brand-500"/> Active Customers</span>
                <span className="text-3xl font-bold tabular-nums mt-2">136</span>
              </div>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-500"/> New Customers</span>
                <span className="text-3xl font-bold tabular-nums mt-2">51</span>
              </div>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><UserMinus className="w-4 h-4 text-destructive dark:text-red-400"/> Lost Customers</span>
                <span className="text-3xl font-bold tabular-nums mt-2">22</span>
              </div>
              <div className="bg-card dark:bg-zinc-950 border border-border rounded-xl p-5 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4 text-brand-600 dark:text-brand-500"/> Avg Churn Rate</span>
                <span className="text-3xl font-bold tabular-nums mt-2">1.5%</span>
              </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="border border-border bg-card dark:bg-zinc-950 rounded-xl shadow-sm overflow-hidden mt-4">
              <div className="p-5 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Monthly Breakdown</h3>
                <p className="text-sm text-muted-foreground mt-1">Customer and revenue changes over the last 12 months.</p>
              </div>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">Month</TableHead>
                    <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">Active</TableHead>
                    <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">+New</TableHead>
                    <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">-Lost</TableHead>
                    <TableHead className="w-[100px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">Churn %</TableHead>
                    <TableHead className="w-[140px] text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 text-right">Net Rev Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RETENTION_MONTHS.map((month) => {
                    const isExpanded = expandedMonth === month.id
                    const Chevron = isExpanded ? ChevronDown : ChevronRight

                    return (
                      <Fragment key={month.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer group hover:bg-muted/50 transition-colors",
                            isExpanded && "border-b-0"
                          )}
                          onClick={() => toggleMonth(month.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Chevron className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{month.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium tabular-nums">{month.active}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums text-emerald-600 dark:text-emerald-500">+{month.newCount}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums text-destructive dark:text-red-400">-{month.lostCount}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums text-muted-foreground">{month.churnPct}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums text-emerald-600 dark:text-emerald-500 font-medium">{month.netRevImpact}</span>
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <tr className="border-b border-border bg-zinc-50/50 dark:bg-zinc-900/20">
                            <td colSpan={6} className="p-0">
                              <div className="p-4 sm:p-6 shadow-inner border-l-[3px] border-brand-500 bg-zinc-50/50 dark:bg-zinc-900/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                  <div className="bg-background dark:bg-zinc-950 border border-border rounded-lg p-5 flex flex-col shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
                                      <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> New Customers ({month.newCount})
                                      </span>
                                      <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-500">{month.gainsTotal}</span>
                                    </div>
                                    {month.gains.map((entry) => (
                                      <div key={entry.name} className="flex items-center justify-between py-1.5 group">
                                        <div className="flex items-center gap-3">
                                          <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">N</div>
                                          <span className="text-sm text-foreground font-medium">{entry.name}</span>
                                        </div>
                                        <span className="text-sm tabular-nums text-emerald-600 dark:text-emerald-500 font-medium">{entry.amount}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-background dark:bg-zinc-950 border border-border rounded-lg p-5 flex flex-col shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
                                      <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                                        <UserMinus className="w-4 h-4 text-destructive dark:text-red-400" /> Churned Customers ({month.lostCount})
                                      </span>
                                      <span className="text-sm font-bold tabular-nums text-destructive dark:text-red-400">{month.lossesTotal}</span>
                                    </div>
                                    {month.losses.map((entry) => (
                                      <div key={entry.name} className="flex items-center justify-between py-1.5 group">
                                        <div className="flex items-center gap-3">
                                          <div className="w-5 h-5 rounded bg-destructive/10 text-destructive dark:text-red-400 flex items-center justify-center text-[10px] font-bold">L</div>
                                          <span className="text-sm text-foreground font-medium">{entry.name}</span>
                                        </div>
                                        <span className="text-sm tabular-nums text-destructive dark:text-red-400 font-medium">{entry.amount}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ClientRow({
  client,
  isExpanded,
  statusConfig,
  onToggle,
}: {
  client: ClientRowData
  isExpanded: boolean
  statusConfig: { dot: string; text: string }
  onToggle: () => void
}) {
  const Chevron = isExpanded ? ChevronDown : ChevronRight

  return (
    <>
      <TableRow
        className={cn(
          "group cursor-pointer transition-colors",
          isExpanded && "border-b-0"
        )}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            <Chevron className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium text-foreground">{client.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", statusConfig.dot)} />
            <span className={statusConfig.text}>{client.status}</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="text-right tabular-nums font-medium">
            {client.revenue90d}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="text-right tabular-nums text-muted-foreground">
            {client.margin}
          </div>
        </TableCell>
        <TableCell className="text-right tabular-nums text-muted-foreground">
          <div className="tabular-nums text-muted-foreground">
            {client.tenure}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div
            className={cn(
              "text-right tabular-nums",
              client.status === "At Risk"
                ? "font-medium text-amber-600 dark:text-amber-500"
                : "text-muted-foreground"
            )}
          >
            {client.openAr}
          </div>
        </TableCell>
        <TableCell>
          {client.riskSignals.length > 0 ? (
            <div className="flex gap-2">
              {client.riskSignals.map((signal) => (
                <Badge
                  key={signal.label}
                  variant="outline"
                  className={cn(
                    "font-normal shadow-none",
                    signal.variant === "amber"
                      ? "bg-amber-500/5 text-amber-600 dark:text-amber-500 border-amber-500/20"
                      : "bg-destructive/5 text-destructive dark:text-red-400 border-destructive/20"
                  )}
                >
                  {signal.label}
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
          <TableCell colSpan={7} className="p-0">
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
