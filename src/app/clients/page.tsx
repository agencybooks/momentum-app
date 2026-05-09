import { getClients } from "@/lib/db/services"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ClientsPage() {
  const clients = await getClients()

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Roster & Unit Economics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into client performance and concentration risks.</p>
      </div>

      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Client Name</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Tenure</TableHead>
              <TableHead className="text-right text-muted-foreground">Margin</TableHead>
              <TableHead className="text-right text-muted-foreground">MRR</TableHead>
              <TableHead className="text-right text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const isAtRisk = client.status === "At Risk"
              return (
                <TableRow key={client.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {client.name}
                  </TableCell>
                  <TableCell>
                    {isAtRisk ? (
                      <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/5 font-medium">
                        At Risk
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground font-normal">
                        Healthy
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.tenure_months} mos
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-foreground tabular-nums tracking-tight">
                    {(client.margin * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-foreground tabular-nums tracking-tight">
                    {formatCurrency(client.mrr)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`?drawer=client-ledger&clientId=${client.id}`} scroll={false}>
                      <Button variant="outline" size="sm" className="h-8">
                        View Ledger ↗
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
