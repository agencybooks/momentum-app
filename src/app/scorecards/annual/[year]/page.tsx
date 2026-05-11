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
import {
  annual2025RevenueBridge,
  annual2025CashBridge,
  annual2026RevenueBridge,
  annual2026CashBridge,
} from "@/lib/mock-data"

const annualData: Record<string, {
  title: string
  subtitle: string
  narrative: { highlights: string[]; warnings: string[] }
  kpis: { label: string; value: string; trend: string; positive: boolean }[]
  revenueBridge: typeof annual2025RevenueBridge
  cashBridge: typeof annual2025CashBridge
  offTrack: { metric: string; actual: string; gap: string }[]
  onTrack: { metric: string; actual: string; gap: string }[]
}> = {
  "2025": {
    title: "2025 Annual Scorecard",
    subtitle: "Closed Year — Full 12-Month Review",
    narrative: {
      highlights: [
        "Revenue grew 38% YoY ($32K → $44.2K MRR). Added 4 new logos and expanded 3 existing accounts.",
        "Cash position grew by $42K over the year, ending at $222.8K. Runway remains comfortable at 7+ months.",
      ],
      warnings: [
        "Churn hit $34K annualized — driven primarily by Sundial exit ($12K) and Vertex Labs pause ($9.5K). Net retention dipped below 110%.",
      ],
    },
    kpis: [
      { label: "TOTAL REVENUE", value: "$499,200", trend: "+38% YoY", positive: true },
      { label: "AVG GROSS MARGIN", value: "45.2%", trend: "-2.1 pts vs target", positive: false },
      { label: "TOTAL NET PROFIT", value: "$82,400", trend: "+$18K vs 2024", positive: true },
      { label: "ENDING CASH", value: "$222,800", trend: "+$42K net", positive: true },
    ],
    revenueBridge: annual2025RevenueBridge,
    cashBridge: annual2025CashBridge,
    offTrack: [
      { metric: "Gross Margin", actual: "45.2%", gap: "-4.8pp" },
      { metric: "Logo Churn Rate", actual: "18.5%", gap: "+8.5pp" },
      { metric: "Net Revenue Retention", actual: "108%", gap: "-7pp" },
    ],
    onTrack: [
      { metric: "Revenue Growth", actual: "+38%", gap: "+18pp" },
      { metric: "Cash Runway", actual: "7.2 mo", gap: "+1.2 mo" },
      { metric: "New Logos", actual: "4", gap: "+1" },
      { metric: "DSO", actual: "42d", gap: "-3d" },
    ],
  },
  "2026": {
    title: "2026 YTD Scorecard",
    subtitle: "Year to Date — Jan through Apr 2026",
    narrative: {
      highlights: [
        "Strong start to the year: MRR grew from $44.2K to $55.5K (+26%) in just 4 months. Expansion revenue is the primary driver.",
        "Cash position strengthened to $236.8K. Operating expenses remain well-controlled.",
      ],
      warnings: [
        "Cobalt Outdoor churned in February — $8K monthly impact. Net margin YTD averaging 16.8%, below our 20% annual target.",
      ],
    },
    kpis: [
      { label: "YTD REVENUE", value: "$155,500", trend: "On pace for $466K", positive: true },
      { label: "AVG GROSS MARGIN", value: "48.0%", trend: "-2.0 pts vs target", positive: false },
      { label: "YTD NET PROFIT", value: "$26,100", trend: "16.8% margin", positive: false },
      { label: "ENDING CASH", value: "$236,800", trend: "+$14K net", positive: true },
    ],
    revenueBridge: annual2026RevenueBridge,
    cashBridge: annual2026CashBridge,
    offTrack: [
      { metric: "Net Margin", actual: "16.8%", gap: "-3.2pp" },
      { metric: "Gross Margin", actual: "48.0%", gap: "-2.0pp" },
      { metric: "Logo Churn (Ann.)", actual: "14.3%", gap: "+4.3pp" },
    ],
    onTrack: [
      { metric: "Revenue Growth", actual: "+26%", gap: "+6pp" },
      { metric: "Cash Position", actual: "$236.8K", gap: "+$14K" },
      { metric: "New Logos", actual: "2", gap: "On pace" },
      { metric: "Expansion Revenue", actual: "$14.8K", gap: "+$4.8K" },
    ],
  },
}

interface Props {
  params: Promise<{ year: string }>
}

export default async function AnnualScorecardPage({ params }: Props) {
  const { year } = await params

  const data = annualData[year]
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">No annual scorecard data for {year}.</p>
        <Link href="/scorecards">
          <Button variant="outline">Back to Scorecards</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/scorecards" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{data.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.subtitle}</p>
          </div>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
      </div>

      {/* Narrative */}
      <div className="p-6 mb-8 bg-muted/30 border border-dashed rounded-xl space-y-4 text-sm leading-relaxed">
        {data.narrative.highlights.map((text, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
            <p>{text}</p>
          </div>
        ))}
        {data.narrative.warnings.map((text, i) => (
          <div key={i} className="flex gap-3 items-start text-destructive">
            <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
            <p>{text}</p>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label} className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums">{kpi.value}</div>
              <div className="mt-2 flex items-center gap-1.5 text-sm">
                <div className={`h-2 w-2 rounded-full shrink-0 ${kpi.positive ? "bg-success" : "bg-destructive"}`} />
                <span className={`font-medium ${kpi.positive ? "text-success" : "text-destructive"}`}>{kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Asymmetric Grid: Bridges + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bridge Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wider font-sans">Revenue Bridge</h3>
            <BridgeWaterfallChart steps={data.revenueBridge} />
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wider font-sans">Cash Bridge</h3>
            <BridgeWaterfallChart steps={data.cashBridge} />
          </Card>
        </div>

        {/* Right: Goals Matrix */}
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
                  {data.offTrack.map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="font-medium">{row.metric}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.actual}</TableCell>
                      <TableCell className="text-destructive text-right font-medium tabular-nums">{row.gap}</TableCell>
                    </TableRow>
                  ))}
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
                  {data.onTrack.map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="font-medium">{row.metric}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.actual}</TableCell>
                      <TableCell className="text-success text-right font-medium tabular-nums">{row.gap}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-xs py-3 cursor-pointer hover:text-primary">
                      View all on-track goals <ChevronDown className="h-3 w-3 inline" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>

      {/* Deep-Dive CTAs */}
      <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-primary">Dive into the details</h3>
          <p className="text-sm text-muted-foreground">Explore the financial engines with the {year} period filter applied.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/profitability"><Button variant="outline">View Profitability</Button></Link>
          <Link href="/cash"><Button variant="outline">View Cash Flows</Button></Link>
        </div>
      </div>
    </div>
  )
}
