"use client"

import * as React from "react"
import { getClient, getInvoicesByClient } from "@/lib/db/services"
import { Client, Invoice } from "@/lib/db/types"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ARIntelligenceDrawerProps {
  clientId: string | null
}

export function ARIntelligenceDrawer({ clientId }: ARIntelligenceDrawerProps) {
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
        // Only show overdue or open invoices, perhaps? The prompt says "specific overdue invoices" 
        // We will filter by overdue if needed, or just show the invoices for the client that are overdue.
        setInvoices((invoicesData || []).filter(inv => inv.status === "Overdue" || inv.status === "Open"))
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
    return <div className="p-6 text-muted-foreground">Loading intelligence...</div>
  }

  if (!client) {
    return <div className="p-6 text-destructive">Client not found.</div>
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-8 p-8">
      <SheetHeader className="pb-4 border-b border-border text-left">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-2xl font-bold text-foreground">
            {client.name}
          </SheetTitle>
          {client.status === "At Risk" && (
            <Badge variant="destructive">At Risk</Badge>
          )}
          {client.status === "Healthy" && (
            <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-success/20">Healthy</Badge>
          )}
        </div>
        <SheetDescription>
          Accounts Receivable Intelligence
        </SheetDescription>
      </SheetHeader>

      {/* Client Vitals */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Client Vitals</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">MRR</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(client.mrr)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">Margin</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold tabular-nums text-foreground">
                {(client.margin * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">Tenure</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold tabular-nums text-foreground">
                {client.tenure_months}m
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Exposure */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-foreground">Active Exposure</h3>
        <div className="rounded-md border border-border bg-card">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Invoice</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
                <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-border">
                    <TableCell className="font-medium text-sm text-foreground">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {invoice.status === "Overdue" ? (
                        <span className="text-xs font-medium text-destructive">
                          {invoice.daysOverdue} days late
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          {invoice.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-foreground">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-16 text-center text-xs text-muted-foreground">
                    No active exposure.
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
