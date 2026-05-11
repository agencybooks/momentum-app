"use client"

import * as React from "react"
import { useQueryState } from "nuqs"
import { getClient } from "@/lib/db/services"
import { Client } from "@/lib/db/types"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LifeBuoy, Users } from "lucide-react"

interface ActionInsightDrawerProps {
  clientId: string | null
}

export function ActionInsightDrawer({ clientId }: ActionInsightDrawerProps) {
  const [, setDrawer] = useQueryState("drawer")
  const [client, setClient] = React.useState<Client | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!clientId) return

    let isMounted = true
    setLoading(true)

    getClient(clientId).then((data) => {
      if (isMounted) {
        setClient(data || null)
        setLoading(false)
      }
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    return () => { isMounted = false }
  }, [clientId])

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading...</div>
  }

  if (!client) {
    return <div className="p-8 text-destructive">Client not found.</div>
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative px-6 pt-6">
        <SheetHeader className="text-left p-0">
          <SheetTitle className="text-xl font-semibold tracking-tight">{client.name}</SheetTitle>
          <SheetDescription className="mt-1">Contract Renewal • Enterprise Tier</SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 pr-4 -mr-2">
        {/* Insight Banner */}
        <div className="bg-destructive/5 dark:bg-destructive/10 border border-destructive/15 rounded-lg p-3 flex items-start gap-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            Concentration Risk: {client.name} represents 33% of your total MRR. Churning this account will reduce your runway by 1.2 months.
          </p>
        </div>

        {/* CRM Snapshot Grid */}
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Account Snapshot</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/50">
            <span className="text-xs text-muted-foreground">Current MRR</span>
            <span className="text-sm font-semibold tabular-nums">{formatCurrency(client.mrr)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/50">
            <span className="text-xs text-muted-foreground">Renewal Date</span>
            <span className="text-sm font-semibold">June 9, 2026</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/50">
            <span className="text-xs text-muted-foreground">Health Score</span>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-transparent hover:bg-amber-500/20 w-fit">At Risk</Badge>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-border/50">
            <span className="text-xs text-muted-foreground">YTD Usage</span>
            <span className="text-sm font-semibold tabular-nums">115% (Overage)</span>
          </div>
        </div>

        {/* Context Ledger */}
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Context</h3>
        <div className="flex flex-col gap-0 pb-6">
          <div className="group flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-border/50 last:border-0">
            <div className="flex items-start gap-3">
              <LifeBuoy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Sev-1 Support Ticket</span>
                <span className="text-xs text-muted-foreground mt-1">API latency issues escalated by CTO.</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-2 sm:mt-0 whitespace-nowrap">2 days ago</span>
          </div>
          <div className="group flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-border/50 last:border-0">
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Executive QBR</span>
                <span className="text-xs text-muted-foreground mt-1">Discussed workflow bottlenecks.</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-2 sm:mt-0 whitespace-nowrap">3 months ago</span>
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="mt-auto pt-4 pb-6 px-6 -mx-6 -mb-6 border-t border-border bg-background/95 backdrop-blur-sm flex items-center justify-between gap-3 sticky bottom-0 z-20">
        <Button variant="ghost" className="text-muted-foreground" onClick={() => setDrawer(null)}>Dismiss</Button>
        <div className="flex gap-2">
          <Button variant="outline">View CRM</Button>
          <Button className="shrink-0 whitespace-nowrap bg-brand-600 hover:bg-brand-500 text-white shadow-sm border-transparent dark:bg-brand-500 dark:hover:bg-brand-400">Draft Renewal</Button>
        </div>
      </div>
    </div>
  )
}
