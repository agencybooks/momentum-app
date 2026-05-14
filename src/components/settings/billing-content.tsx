"use client"

import { Lock, CreditCard, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SettingsData } from "@/lib/db/types"

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Paid: "default",
  Pending: "secondary",
  Failed: "destructive",
}

export function BillingContent({
  billing,
  currentUserRole,
}: {
  billing: SettingsData["billing"]
  currentUserRole: string
}) {
  if (currentUserRole !== "Admin") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">Admin Access Required</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Contact your administrator to manage team and billing settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active Momentum OS subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{billing.plan.name}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono tabular-nums">${billing.plan.price}</span>/{billing.plan.interval}
              </p>
            </div>
            <Button variant="outline">Manage Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>The card used for automatic billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {billing.paymentMethod.brand} ending in {billing.paymentMethod.last4}
                </p>
                <p className="text-xs text-muted-foreground">Expires {billing.paymentMethod.expiry}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Download past invoices for your records.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Date</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent text-right">Amount</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
                <TableHead className="w-12 text-sm font-medium text-muted-foreground border-b bg-transparent" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {billing.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[invoice.status]}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-xs" aria-label="Download invoice">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
