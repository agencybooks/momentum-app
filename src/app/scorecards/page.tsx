import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export default function ScorecardsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Scorecards</h1>
        <p className="text-muted-foreground mt-1">Your closed financial periods and annual reviews.</p>
      </div>

      {/* Zone 1: Current Active Month */}
      <Card className="p-6 border-dashed bg-muted/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div className="text-left">
          <div className="flex items-center gap-2 font-semibold text-sm mb-1">May 2026 (In Progress)</div>
          <p className="text-sm text-muted-foreground">Books remain open. 14 days remaining in period.</p>
        </div>
        <Button variant="outline" size="sm">View Live Dashboard</Button>
      </Card>

      {/* Zone 2: 2026 YTD */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-semibold tracking-tight">2026 (Year to Date)</h2>
          <Button variant="ghost" size="sm">Export YTD</Button>
        </div>
        <div className="text-sm text-muted-foreground">Rev: $155.5K | Margin: 48.0% | Cash Added: +$14K</div>
        <Link href="/scorecards/annual/2026" className="text-sm font-medium text-primary hover:underline flex items-center">
          <ArrowUpRight className="h-4 w-4 mr-1" /> View 2026 YTD Annual Scorecard
        </Link>
        <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Gr. Margin</TableHead>
              <TableHead className="text-right">Op. Income</TableHead>
              <TableHead className="text-right">Goals Hit</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">April 2026</TableCell>
              <TableCell className="text-right tabular-nums">$41,500</TableCell>
              <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>50.1%</TableCell>
              <TableCell className="text-right tabular-nums">$7,900</TableCell>
              <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>8/13</TableCell>
              <TableCell className="text-right"><Link href="/scorecards/april-2026"><Button variant="outline" size="sm">View Brief</Button></Link></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">March 2026</TableCell>
              <TableCell className="text-right tabular-nums">$38,000</TableCell>
              <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>48.2%</TableCell>
              <TableCell className="text-right tabular-nums">$5,400</TableCell>
              <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>6/13</TableCell>
              <TableCell className="text-right"><Button variant="outline" size="sm">View Brief</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      </div>

      {/* Zone 3: 2025 Closed Year */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-semibold tracking-tight">2025 (Closed Year)</h2>
          <Button variant="ghost" size="sm">Export PDF</Button>
        </div>
        <div className="text-sm text-muted-foreground">Rev: $499.2K | Margin: 45.2% | Cash Added: +$42K</div>
        <Link href="/scorecards/annual/2025" className="text-sm font-medium text-primary hover:underline flex items-center">
          <ArrowUpRight className="h-4 w-4 mr-1" /> View 2025 Annual Scorecard (Year in Review)
        </Link>
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Gr. Margin</TableHead>
                <TableHead className="text-right">Op. Income</TableHead>
                <TableHead className="text-right">Goals Hit</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">December 2025</TableCell>
                <TableCell className="text-right tabular-nums">$44,200</TableCell>
                <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>51.0%</TableCell>
                <TableCell className="text-right tabular-nums">$9,100</TableCell>
                <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>9/13</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm">View Brief</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">November 2025</TableCell>
                <TableCell className="text-right tabular-nums">$40,800</TableCell>
                <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>47.5%</TableCell>
                <TableCell className="text-right tabular-nums">$6,200</TableCell>
                <TableCell className="text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>7/13</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm">View Brief</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <div className="text-center text-sm font-medium text-muted-foreground py-4 cursor-pointer hover:text-primary transition-colors">View all 12 months <ChevronDown className="h-3 w-3 inline" /></div>
      </div>
    </div>
  )
}
