"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { pipelineOpportunities } from "@/lib/mock-data"

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function probabilityBadgeClass(prob: number): string {
  if (prob >= 80) return "bg-success/10 text-success border-success/20"
  if (prob >= 20) return "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"
  return "bg-muted text-muted-foreground border-border"
}

export function PipelineLedger() {
  const totalWeightedValue = pipelineOpportunities.reduce(
    (sum, o) => sum + (o.value * o.probability / 100), 0
  )

  return (
    <Card className="flex flex-col border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">Forward Pipeline</CardTitle>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <span className="text-sm text-muted-foreground">
            Weighted: <span className="font-semibold text-foreground font-mono tabular-nums">{currencyFmt.format(totalWeightedValue)}/mo</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-4">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[45%] text-sm font-medium text-muted-foreground border-b bg-transparent">Client</TableHead>
              <TableHead className="w-[25%] text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Value</TableHead>
              <TableHead className="w-[30%] text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Prob</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelineOpportunities.map((opp) => (
              <TableRow key={opp.id} className="hover:bg-muted/50">
                <TableCell className="py-2.5 px-3">
                  <span className="font-medium text-foreground text-sm">{opp.clientName}</span>
                  <span className="text-xs text-muted-foreground block">{opp.type}</span>
                </TableCell>
                <TableCell className="py-2.5 px-3 text-right font-mono tabular-nums font-medium text-success text-sm">
                  +{currencyFmt.format(opp.value)}
                </TableCell>
                <TableCell className="py-2.5 px-3 text-right">
                  <Badge variant="outline" className={cn("shadow-none text-xs", probabilityBadgeClass(opp.probability))}>
                    {opp.probability}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
