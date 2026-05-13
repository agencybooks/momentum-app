"use client"

import * as React from "react"
import { getClient, getInvoicesByClient } from "@/lib/db/services"
import { Client, Invoice } from "@/lib/db/types"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MetricAnchor } from "@/components/metric-anchor"
import { cn } from "@/lib/utils"

interface ClientLedgerDrawerProps {
  clientId: string | null
}

export function ClientLedgerDrawer({ clientId }: ClientLedgerDrawerProps) {
  const [client, setClient] = React.useState<Client | null>(null)
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!clientId) return

    let isMounted = true
    setLoading(true)

    Promise.all([
      getClient(clientId),
      getInvoicesByClient(clientId)
    ]).then(([clientData, invoicesData]) => {
      if (isMounted) {
        setClient(clientData || null)
        // Sort invoices by date descending
        setInvoices((invoicesData || []).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()))
        setLoading(false)
      }
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [clientId])

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading ledger...</div>
  }

  if (!client) {
    return <div className="p-8 text-destructive">Client not found.</div>
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <SheetHeader className="pb-4 border-b border-border text-left">
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle className="text-3xl font-bold tracking-tight text-foreground">
              {client.name}
            </SheetTitle>
            <SheetDescription className="mt-1">
              Deep analytics and historical ledger.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-3">
            {client.status === "At Risk" ? (
              <Badge variant="destructive" className="px-3 py-1 text-sm">At Risk</Badge>
            ) : (
              <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-success/20 px-3 py-1 text-sm">Healthy</Badge>
            )}
          </div>
        </div>
      </SheetHeader>

      {/* Vitals Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MetricAnchor
          title="Monthly Recurring Revenue"
          value={formatCurrency(client.mrr)}
          isHealthy={true}
        />
        <MetricAnchor
          title="Gross Margin"
          value={`${(client.margin * 100).toFixed(0)}%`}
          isHealthy={client.margin >= 0.5}
        />
        <MetricAnchor
          title="Tenure"
          value={`${client.tenure_months} mos`}
          isHealthy={true}
        />
      </div>

      {/* Ledger Table */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-foreground tracking-tight">Invoice History</h3>
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Invoice #</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Due Date</TableHead>
                <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => {
                  const isOverdue = invoice.status === "Overdue"
                  const isPaid = invoice.status === "Paid"
                  return (
                    <TableRow key={invoice.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        {isOverdue ? (
                          <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/5">
                            {invoice.daysOverdue} days late
                          </Badge>
                        ) : isPaid ? (
                          <Badge variant="outline" className="text-success border-success/30 bg-success/5">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            {invoice.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-foreground tabular-nums tracking-tight">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No invoice history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
