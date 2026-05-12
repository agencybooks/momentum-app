"use client"

import { useQueryState } from "nuqs"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DrawerPeriodSelector } from "@/components/ui/custom/drawer-period-selector"
import { filterByPeriod, periodLabel, DEFAULT_PERIOD, computePeriodAverage } from "@/lib/period-utils"
import {
  FinancialChart,
  EXPENSE_AMOUNT_SERIES,
  type ChartSeries,
} from "@/components/ui/custom/financial-chart"

export const EXPENSE_DEPARTMENT_DRAWER_IDS = [
  "payroll-delivery", "payroll-marketing", "payroll-sales", "payroll-admin",
  "software-delivery", "software-marketing", "software-sales", "software-admin",
] as const

interface BreakdownItem {
  name: string
  amount: number
  change: string
  sentiment: "positive" | "negative" | "neutral"
}

interface ExpenseDeptSpec {
  title: string
  subtitle: string
  headerValue: string
  headerDelta: string
  deltaDirection: "up" | "down" | "flat"
  alertType: "warning" | "success" | "info"
  alertMessage: string
  trendData: { month: string; amount: number }[]
  breakdownTitle: string
  breakdown: BreakdownItem[]
  series: ChartSeries[]
}

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const SPECS: Record<string, ExpenseDeptSpec> = {
  "payroll-delivery": {
    title: "Delivery Payroll",
    subtitle: "Payroll: $16,800/mo | 30.5% of revenue",
    headerValue: "$16,800",
    headerDelta: "+3.2%",
    deltaDirection: "up",
    alertType: "warning",
    alertMessage: "Delivery payroll rose 3.2% MoM driven by contractor hours on the Cobalt Outdoor engagement. QA overtime added $500 above baseline.",
    trendData: [
      { month: "Dec", amount: 15200 },
      { month: "Jan", amount: 15400 },
      { month: "Feb", amount: 15600 },
      { month: "Mar", amount: 15900 },
      { month: "Apr", amount: 16280 },
      { month: "May", amount: 16800 },
    ],
    breakdownTitle: "Team Breakdown",
    breakdown: [
      { name: "Lead Engineers", amount: 8200, change: "+2.5%", sentiment: "negative" },
      { name: "Project Managers", amount: 5100, change: "+4.1%", sentiment: "negative" },
      { name: "QA Engineers", amount: 3500, change: "+3.0%", sentiment: "negative" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "payroll-sales": {
    title: "Sales Payroll",
    subtitle: "Payroll: $5,000/mo | 9.1% of revenue",
    headerValue: "$5,000",
    headerDelta: "—",
    deltaDirection: "flat",
    alertType: "success",
    alertMessage: "Sales payroll held flat at $5,000. Headcount stable with no planned additions through Q3.",
    trendData: [
      { month: "Dec", amount: 5000 },
      { month: "Jan", amount: 5000 },
      { month: "Feb", amount: 5000 },
      { month: "Mar", amount: 5000 },
      { month: "Apr", amount: 5000 },
      { month: "May", amount: 5000 },
    ],
    breakdownTitle: "Team Breakdown",
    breakdown: [
      { name: "Account Executive", amount: 3200, change: "—", sentiment: "neutral" },
      { name: "Business Dev Rep", amount: 1800, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "payroll-marketing": {
    title: "Marketing Payroll",
    subtitle: "Payroll: $4,200/mo | 7.6% of revenue",
    headerValue: "$4,200",
    headerDelta: "-4.5%",
    deltaDirection: "down",
    alertType: "success",
    alertMessage: "Marketing payroll decreased 4.5% after reducing freelance content hours. Core team compensation unchanged.",
    trendData: [
      { month: "Dec", amount: 4600 },
      { month: "Jan", amount: 4500 },
      { month: "Feb", amount: 4500 },
      { month: "Mar", amount: 4400 },
      { month: "Apr", amount: 4400 },
      { month: "May", amount: 4200 },
    ],
    breakdownTitle: "Team Breakdown",
    breakdown: [
      { name: "Content Strategist", amount: 2400, change: "—", sentiment: "neutral" },
      { name: "SEO Specialist", amount: 1800, change: "-8.3%", sentiment: "positive" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "payroll-admin": {
    title: "Admin Payroll",
    subtitle: "Payroll: $3,500/mo | 6.4% of revenue",
    headerValue: "$3,500",
    headerDelta: "—",
    deltaDirection: "flat",
    alertType: "success",
    alertMessage: "Admin payroll stable at $3,500. Operations Lead and part-time Bookkeeper holding at target rates.",
    trendData: [
      { month: "Dec", amount: 3500 },
      { month: "Jan", amount: 3500 },
      { month: "Feb", amount: 3500 },
      { month: "Mar", amount: 3500 },
      { month: "Apr", amount: 3500 },
      { month: "May", amount: 3500 },
    ],
    breakdownTitle: "Team Breakdown",
    breakdown: [
      { name: "Operations Lead", amount: 2200, change: "—", sentiment: "neutral" },
      { name: "Bookkeeper (Part-Time)", amount: 1300, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "software-delivery": {
    title: "Delivery Software",
    subtitle: "Software: $3,400/mo | 6.2% of revenue",
    headerValue: "$3,400",
    headerDelta: "+8.0%",
    deltaDirection: "up",
    alertType: "warning",
    alertMessage: "Delivery software costs up 8.0% MoM. Figma team plan upgrade and new AWS dev tooling drove the increase.",
    trendData: [
      { month: "Dec", amount: 2800 },
      { month: "Jan", amount: 2900 },
      { month: "Feb", amount: 3000 },
      { month: "Mar", amount: 3050 },
      { month: "Apr", amount: 3150 },
      { month: "May", amount: 3400 },
    ],
    breakdownTitle: "License Breakdown",
    breakdown: [
      { name: "Figma Organization", amount: 1200, change: "+20%", sentiment: "negative" },
      { name: "AWS Dev Tools", amount: 900, change: "+12.5%", sentiment: "negative" },
      { name: "GitHub Enterprise", amount: 800, change: "—", sentiment: "neutral" },
      { name: "Jira", amount: 500, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "software-marketing": {
    title: "Marketing Software",
    subtitle: "Software: $1,605/mo | 2.9% of revenue",
    headerValue: "$1,605",
    headerDelta: "+6.3%",
    deltaDirection: "up",
    alertType: "warning",
    alertMessage: "Marketing software up 6.3% from HubSpot seat addition. Google Ads platform fees tracking to budget.",
    trendData: [
      { month: "Dec", amount: 1380 },
      { month: "Jan", amount: 1400 },
      { month: "Feb", amount: 1420 },
      { month: "Mar", amount: 1450 },
      { month: "Apr", amount: 1510 },
      { month: "May", amount: 1605 },
    ],
    breakdownTitle: "License Breakdown",
    breakdown: [
      { name: "HubSpot", amount: 800, change: "+14.3%", sentiment: "negative" },
      { name: "Google Ads Platform", amount: 480, change: "—", sentiment: "neutral" },
      { name: "Hootsuite", amount: 325, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "software-sales": {
    title: "Sales Software",
    subtitle: "Software: $1,050/mo | 1.9% of revenue",
    headerValue: "$1,050",
    headerDelta: "—",
    deltaDirection: "flat",
    alertType: "success",
    alertMessage: "Sales software stack stable at $1,050/mo. All licenses at contracted rates through Q4.",
    trendData: [
      { month: "Dec", amount: 1050 },
      { month: "Jan", amount: 1050 },
      { month: "Feb", amount: 1050 },
      { month: "Mar", amount: 1050 },
      { month: "Apr", amount: 1050 },
      { month: "May", amount: 1050 },
    ],
    breakdownTitle: "License Breakdown",
    breakdown: [
      { name: "Salesforce", amount: 650, change: "—", sentiment: "neutral" },
      { name: "LinkedIn Sales Navigator", amount: 250, change: "—", sentiment: "neutral" },
      { name: "Gong", amount: 150, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
  "software-admin": {
    title: "Admin Software",
    subtitle: "Software: $750/mo | 1.4% of revenue",
    headerValue: "$750",
    headerDelta: "+4.2%",
    deltaDirection: "up",
    alertType: "info",
    alertMessage: "Minor uptick from Google Workspace storage tier upgrade. Slack and Notion holding at current plans.",
    trendData: [
      { month: "Dec", amount: 700 },
      { month: "Jan", amount: 700 },
      { month: "Feb", amount: 710 },
      { month: "Mar", amount: 720 },
      { month: "Apr", amount: 720 },
      { month: "May", amount: 750 },
    ],
    breakdownTitle: "License Breakdown",
    breakdown: [
      { name: "Google Workspace", amount: 320, change: "+6.7%", sentiment: "negative" },
      { name: "Slack", amount: 250, change: "—", sentiment: "neutral" },
      { name: "Notion", amount: 180, change: "—", sentiment: "neutral" },
    ],
    series: EXPENSE_AMOUNT_SERIES,
  },
}

const dotColorMap: Record<BreakdownItem["sentiment"], string> = {
  positive: "bg-emerald-500",
  negative: "bg-destructive",
  neutral: "bg-muted-foreground",
}

const changeColorMap: Record<BreakdownItem["sentiment"], string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
}

const alertStyles: Record<ExpenseDeptSpec["alertType"], { border: string; bg: string; icon: typeof AlertCircle; iconColor: string; textColor: string }> = {
  warning: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-500",
    textColor: "text-amber-800 dark:text-amber-400",
  },
  success: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-500",
    textColor: "text-emerald-800 dark:text-emerald-400",
  },
  info: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    icon: AlertCircle,
    iconColor: "text-blue-600 dark:text-blue-500",
    textColor: "text-blue-800 dark:text-blue-400",
  },
}

export function ExpenseDepartmentDrawerContent({ drawerId }: { drawerId: string }) {
  const [period, setPeriod] = useQueryState("period", { defaultValue: DEFAULT_PERIOD })
  const spec = SPECS[drawerId]
  if (!spec) return null

  const filteredTrendData = filterByPeriod(spec.trendData, period)
  const periodAverage = computePeriodAverage(filteredTrendData, "amount", "currency")
  const alert = alertStyles[spec.alertType]
  const AlertIcon = alert.icon

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-xl font-semibold tracking-tight">
          {spec.title}
        </SheetTitle>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-bold font-mono tabular-nums">
            {spec.headerValue}
          </span>
          {spec.deltaDirection !== "flat" ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full",
                spec.deltaDirection === "up"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              )}
            >
              {spec.deltaDirection === "up" ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {spec.headerDelta}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground font-medium">
              {spec.headerDelta}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{spec.subtitle}</p>
      </SheetHeader>

      <Separator className="my-6" />

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div
          className={cn(
            "w-full border rounded-lg flex items-start gap-3 p-3 mb-6",
            alert.border,
            alert.bg
          )}
        >
          <AlertIcon className={cn("w-4 h-4 mt-0.5 shrink-0", alert.iconColor)} />
          <span className={cn("text-sm font-medium", alert.textColor)}>
            {spec.alertMessage}
          </span>
        </div>

        <DrawerPeriodSelector value={period} onValueChange={setPeriod} periodAverage={periodAverage} />

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {periodLabel(period)}
          </h3>
          <div className="w-full min-h-[280px]">
            <FinancialChart
              data={filteredTrendData}
              series={spec.series}
              xAxisKey="month"
              yAxisFormat="currency"
              hideLegend
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {spec.breakdownTitle}
          </h3>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {spec.breakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full shrink-0", dotColorMap[item.sentiment])} />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums">{currencyFmt.format(item.amount)}</span>
                    <span className={cn("text-xs font-medium tabular-nums", changeColorMap[item.sentiment])}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
