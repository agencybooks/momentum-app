"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import type { EnrichedClient } from "@/lib/db/types"

interface MoverRow {
  name: string
  delta: number
  barPct: number
}

export function NrrMoversList({ clients }: { clients: EnrichedClient[] }) {
  const { expansions, contractions } = useMemo(() => {
    const withChange = clients.filter((c) => c.mrrChange !== 0 && c.mrr > 0)

    const exp = withChange
      .filter((c) => c.mrrChange > 0)
      .sort((a, b) => b.mrrChange - a.mrrChange)
      .slice(0, 3)

    const con = withChange
      .filter((c) => c.mrrChange < 0)
      .sort((a, b) => a.mrrChange - b.mrrChange)
      .slice(0, 3)

    const maxDelta = Math.max(
      ...exp.map((c) => c.mrrChange),
      ...con.map((c) => Math.abs(c.mrrChange)),
      1
    )

    const toRow = (c: EnrichedClient): MoverRow => ({
      name: c.name,
      delta: c.mrrChange,
      barPct: (Math.abs(c.mrrChange) / maxDelta) * 100,
    })

    return {
      expansions: exp.map(toRow),
      contractions: con.map(toRow),
    }
  }, [clients])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">NRR Movers</CardTitle>
        <p className="text-sm text-muted-foreground">
          This month&apos;s expansion & contraction
        </p>
      </CardHeader>
      <CardContent className="flex flex-col pt-0">
        {/* Expansion */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Expansion
          </span>
        </div>
        {expansions.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {expansions.map((row) => (
              <div
                key={row.name}
                className="rounded-md px-2 py-1.5 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {row.name}
                  </span>
                  <span className="text-sm font-bold tabular-nums font-mono text-success whitespace-nowrap">
                    +{formatCurrency(row.delta)}
                  </span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success/60 rounded-full transition-all"
                    style={{ width: `${row.barPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2 px-2">
            No expansion this month.
          </p>
        )}

        <div className="border-t border-border my-4" />

        {/* Contraction */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contraction
          </span>
        </div>
        {contractions.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {contractions.map((row) => (
              <div
                key={row.name}
                className="rounded-md px-2 py-1.5 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {row.name}
                  </span>
                  <span className="text-sm font-bold tabular-nums font-mono text-destructive whitespace-nowrap">
                    {formatCurrency(row.delta)}
                  </span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive/60 rounded-full transition-all"
                    style={{ width: `${row.barPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2 px-2">
            No contraction this month.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
