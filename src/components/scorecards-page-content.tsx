"use client"

import Link from "next/link"
import { useQueryState } from "nuqs"
import { Lock, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { formatCurrencyFull } from "@/lib/format"
import type { LivePulseData, SnapshotLedgerEntry } from "@/lib/db/types"

interface ScorecardsPageContentProps {
  livePulse: LivePulseData
  ledgerEntries: SnapshotLedgerEntry[]
}

function LivePulseHero({ data }: { data: LivePulseData }) {
  return (
    <Card className="md:p-8 border-dashed bg-muted/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-success pulse-dot" />
          <span className="font-semibold text-sm tracking-tight">May 2026 (Live Pulse)</span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
            View Live Dashboard
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Days to Close</div>
          <div className="text-2xl font-semibold font-mono tabular-nums">{data.daysToClose}</div>
          <div className="text-xs text-muted-foreground mt-1">days remaining in period</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Cash Runway</div>
          <div className="text-2xl font-semibold font-mono tabular-nums">{data.cashRunwayMonths} <span className="text-sm font-normal text-muted-foreground">Months</span></div>
          <div className="text-xs text-muted-foreground mt-1">at current burn rate</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Unmapped Transactions</div>
          <Link href="/calibration" className="text-2xl font-semibold font-mono tabular-nums text-warning hover:underline underline-offset-4 decoration-warning/40 transition-colors">
            {data.unmappedTransactions} <span className="text-sm font-normal">Items</span>
          </Link>
          <div className="text-xs text-muted-foreground mt-1">require classification</div>
        </div>
      </div>
    </Card>
  )
}

function targetYieldColor(hit: number, total: number) {
  const pct = (hit / total) * 100
  if (pct >= 80) return "bg-success/10 text-success"
  if (pct >= 50) return "bg-warning/10 text-warning"
  return "bg-destructive/10 text-destructive"
}

function SnapshotLedger({
  entries,
  onViewSnapshot,
}: {
  entries: SnapshotLedgerEntry[]
  onViewSnapshot: (slug: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-semibold tracking-tight">Closed Periods</h2>
      </div>
      <Card className="overflow-hidden p-0">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Period</TableHead>
              <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Net Momentum</TableHead>
              <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Cash Delta</TableHead>
              <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Targets Yield</TableHead>
              <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
              <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onViewSnapshot(entry.slug)}
              >
                <TableCell className="font-medium">{entry.period}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  <span className={entry.netMomentum >= 0 ? "text-success" : "text-destructive"}>
                    {entry.netMomentum >= 0 ? "+" : ""}{formatCurrencyFull(entry.netMomentum)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  <span className={entry.cashDelta >= 0 ? "text-success" : "text-destructive"}>
                    {entry.cashDelta >= 0 ? "+" : ""}{formatCurrencyFull(entry.cashDelta)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className={targetYieldColor(entry.targetsHit, entry.targetsTotal)}>
                    {entry.targetsHit}/{entry.targetsTotal}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {entry.isLocked && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewSnapshot(entry.slug)
                    }}
                  >
                    View Snapshot
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export function ScorecardsPageContent({ livePulse, ledgerEntries }: ScorecardsPageContentProps) {
  const [, setDrawer] = useQueryState("drawer")
  const [, setPeriod] = useQueryState("period")

  const openSnapshot = (slug: string) => {
    setPeriod(slug)
    setDrawer("anti-pnl-snapshot")
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Scorecards"
        subtitle="Closed-period snapshots and live pulse."
      />
      <LivePulseHero data={livePulse} />
      <SnapshotLedger entries={ledgerEntries} onViewSnapshot={openSnapshot} />
    </div>
  )
}
