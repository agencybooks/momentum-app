import Link from "next/link"
import { ArrowLeft, Download, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { BridgeWaterfallChart } from "@/components/waterfall/bridge-waterfall-chart"
import { aprilRevenueBridge, aprilCashBridge } from "@/lib/mock-data"

export default function AprilScorecardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/scorecards" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Scorecard: April 2026</h1>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
      </div>

      {/* Zone 1: Narrative */}
      <div className="p-6 mb-8 bg-muted/30 border border-dashed rounded-xl space-y-4 text-sm leading-relaxed">
        <div className="flex gap-3 items-start">
          <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
          <p>April was a highly efficient month. We hit 8 of 13 targets. Revenue grew by $3.5K entirely through expansion, and cash position strengthened by $8K.</p>
        </div>
        <div className="flex gap-3 items-start text-destructive">
          <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
          <p>Warning: Net Margin (16.4%) missed our 20% target, and AR DSO stretched to 56 days.</p>
        </div>
      </div>

      {/* Zone 2: Metric Anchors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">REVENUE (Apr)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums">$41,500</div>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
              <span className="font-medium text-success">+$3.5K vs prior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">GROSS MARGIN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums">50.1%</div>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
              <span className="font-medium text-success">+2.0 pts vs prior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">NET PROFIT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums">$7,900</div>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
              <span className="font-medium text-success">+$2.5K vs prior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">ENDING CASH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums">$222,800</div>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
              <span className="font-medium text-success">+$7.9K vs prior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone 3: Asymmetric Grid — Bridges (left) + Goals Matrix (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bridge Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wider font-sans">Revenue Bridge</h3>
            <BridgeWaterfallChart steps={aprilRevenueBridge} />
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wider font-sans">Cash Bridge</h3>
            <BridgeWaterfallChart steps={aprilCashBridge} />
          </Card>
        </div>

        {/* Right Column: Goals Matrix */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div>
            <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" /> OFF TRACK
            </h3>
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Gap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Net Margin</TableCell>
                    <TableCell className="text-right tabular-nums">16.4%</TableCell>
                    <TableCell className="text-destructive text-right font-medium tabular-nums">-3.6pp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Logo Churn</TableCell>
                    <TableCell className="text-right tabular-nums">14.3%</TableCell>
                    <TableCell className="text-destructive text-right font-medium tabular-nums">+4.3pp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DSO</TableCell>
                    <TableCell className="text-right tabular-nums">56d</TableCell>
                    <TableCell className="text-destructive text-right font-medium tabular-nums">+11d</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold text-success flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4" /> ON TRACK
            </h3>
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Gap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Gross Margin</TableCell>
                    <TableCell className="text-right tabular-nums">50.1%</TableCell>
                    <TableCell className="text-success text-right font-medium tabular-nums">+0.1pp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Revenue</TableCell>
                    <TableCell className="text-right tabular-nums">$41.5K</TableCell>
                    <TableCell className="text-success text-right font-medium tabular-nums">+$3.5K</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cash Position</TableCell>
                    <TableCell className="text-right tabular-nums">$222.8K</TableCell>
                    <TableCell className="text-success text-right font-medium tabular-nums">+$7.9K</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-xs py-3 cursor-pointer hover:text-primary">View all 8 on-track goals <ChevronDown className="h-3 w-3 inline" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>

      {/* Zone 4: Deep-Dive Launchpads */}
      <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-primary">Need to audit the raw ledgers?</h3>
          <p className="text-sm text-muted-foreground">Jump directly to the financial engines with the April filter automatically applied.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">View April Profitability</Button>
          <Button variant="outline">View April Cash Flows</Button>
        </div>
      </div>
    </div>
  )
}
