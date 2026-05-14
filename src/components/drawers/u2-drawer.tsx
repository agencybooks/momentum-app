import React from "react"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight, Lightbulb, CheckCircle2, AlertTriangle, Search, Clock, Check, RotateCcw, ChevronDown, CornerDownRight, TrendingUp, Plus, Minus, Equal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function U2Drawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase inline-flex items-center gap-3">
              Cobalt Outdoor
              <Badge variant="destructive">At Risk</Badge>
            </SheetTitle>
            <SheetDescription>
              Accounts Receivable Intelligence
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="flex gap-3">
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">MRR</div>
                <div className="font-mono font-bold tabular-nums">$4,200</div>
              </Card>
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Margin</div>
                <div className="font-mono font-bold tabular-nums">41%</div>
              </Card>
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Tenure</div>
                <div className="font-mono font-bold tabular-nums">8m</div>
              </Card>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Active Exposure
              </h3>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Invoice</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
                    <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">INV-2001</TableCell>
                    <TableCell className="text-destructive">75 days late</TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-medium">$25,000</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">INV-2002</TableCell>
                    <TableCell className="text-muted-foreground">Open</TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-medium">$4,200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Button className="w-full mt-6">Send Escalation Email</Button>
          </div>
        </>
      )

}