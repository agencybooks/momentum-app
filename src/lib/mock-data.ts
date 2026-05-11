import type { RevenueExpenseTimeline, CashForecastPoint, Payable, CashFlowTimeline, UnitEconomicsPoint, PipelineOpportunity, BaselineTrajectoryPoint } from "@/lib/db/types"
import type { BridgeStep } from "@/components/waterfall/bridge-waterfall-chart"

export const mockChartData: RevenueExpenseTimeline[] = [
  { date: "Feb 15", revenue: 9400, expenses: 7200 },
  { date: "Feb 22", revenue: 9600, expenses: 7100 },
  { date: "Mar 01", revenue: 10500, expenses: 7900 },
  { date: "Mar 08", revenue: 9100, expenses: 7400 },
  { date: "Mar 15", revenue: 9300, expenses: 8800 },
  { date: "Mar 22", revenue: 9500, expenses: 7200 },
  { date: "Mar 29", revenue: 9400, expenses: 7500 },
  { date: "Apr 05", revenue: 11200, expenses: 8100 },
  { date: "Apr 12", revenue: 9800, expenses: 7600 },
  { date: "Apr 19", revenue: 10100, expenses: 9200 },
  { date: "Apr 26", revenue: 10400, expenses: 7800 },
  { date: "May 03", revenue: 11500, expenses: 8400 },
  { date: "May 10", revenue: 10200, expenses: 7900 },
]

export const mockCashBurnData: CashFlowTimeline[] = [
  { date: "Feb 15", cashBalance: 120000, netBurn: -4500 },
  { date: "Feb 22", cashBalance: 115500, netBurn: -4200 },
  { date: "Mar 01", cashBalance: 111300, netBurn: -4800 },
  { date: "Mar 08", cashBalance: 106500, netBurn: -4100 },
  { date: "Mar 15", cashBalance: 102400, netBurn: -5200 },
  { date: "Mar 22", cashBalance: 97200, netBurn: -3800 },
  { date: "Mar 29", cashBalance: 93400, netBurn: -4000 },
  { date: "Apr 05", cashBalance: 89400, netBurn: -3500 },
  { date: "Apr 12", cashBalance: 85900, netBurn: -3900 },
  { date: "Apr 19", cashBalance: 82000, netBurn: -4800 },
  { date: "Apr 26", cashBalance: 77200, netBurn: -3600 },
  { date: "May 03", cashBalance: 73600, netBurn: -4100 },
  { date: "May 10", cashBalance: 69500, netBurn: -3700 },
]

export const sparklineTrendUp = [
  { date: "W1", value: 40 },
  { date: "W2", value: 45 },
  { date: "W3", value: 42 },
  { date: "W4", value: 55 },
  { date: "W5", value: 65 },
  { date: "W6", value: 72 },
  { date: "W7", value: 70 },
  { date: "W8", value: 85 },
]

export const sparklineTrendDown = [
  { date: "W1", value: 85 },
  { date: "W2", value: 80 },
  { date: "W3", value: 72 },
  { date: "W4", value: 65 },
  { date: "W5", value: 55 },
  { date: "W6", value: 60 },
  { date: "W7", value: 48 },
  { date: "W8", value: 42 },
]

export const cashForecastData: CashForecastPoint[] = [
  { week: "Week 1",  cash: 125000, inflows: 18000, outflows: 12000 },
  { week: "Week 2",  cash: 94000,  inflows: 5000,  outflows: 36000 },
  { week: "Week 3",  cash: 110000, inflows: 22000, outflows: 6000  },
  { week: "Week 4",  cash: 79000,  inflows: 4000,  outflows: 35000 },
  { week: "Week 5",  cash: 85000,  inflows: 13000, outflows: 7000  },
  { week: "Week 6",  cash: 54000,  inflows: 3000,  outflows: 34000 },
  { week: "Week 7",  cash: 60000,  inflows: 14000, outflows: 8000  },
  { week: "Week 8",  cash: 28000,  inflows: 2000,  outflows: 34000 },
  { week: "Week 9",  cash: 35000,  inflows: 15000, outflows: 8000  },
  { week: "Week 10", cash: 9000,   inflows: 5000,  outflows: 31000 },
  { week: "Week 11", cash: 22000,  inflows: 20000, outflows: 7000  },
  { week: "Week 12", cash: 15000,  inflows: 4000,  outflows: 11000 },
  { week: "Week 13", cash: 38000,  inflows: 28000, outflows: 5000  },
]

export const grossMarginSparkline = [
  { date: "Dec", value: 52.5 },
  { date: "Jan", value: 52.5 },
  { date: "Feb", value: 52.5 },
  { date: "Mar", value: 52.4 },
  { date: "Apr", value: 51.1 },
  { date: "May", value: 50.1 },
]

export const opMarginSparkline = [
  { date: "Dec", value: 20.8 },
  { date: "Jan", value: 21.0 },
  { date: "Feb", value: 21.2 },
  { date: "Mar", value: 21.1 },
  { date: "Apr", value: 21.0 },
  { date: "May", value: 19.0 },
]

export const netMarginSparkline = [
  { date: "Dec", value: 17.9 },
  { date: "Jan", value: 18.1 },
  { date: "Feb", value: 18.4 },
  { date: "Mar", value: 18.4 },
  { date: "Apr", value: 18.3 },
  { date: "May", value: 16.4 },
]

export const PAYROLL_FLOOR = 31000

export const payables: Payable[] = [
  { id: "ap_01", dueDate: "May 09", vendor: "Gusto (May Payroll)", amount: 31000, canDelay: false },
  { id: "ap_02", dueDate: "May 11", vendor: "AWS Hosting", amount: 4200, canDelay: false },
  { id: "ap_03", dueDate: "May 14", vendor: "HubSpot Annual", amount: 7300, canDelay: true },
]

export const unitEconomicsTrend: UnitEconomicsPoint[] = [
  { month: "Jun 25", ltv: 78200, cac: 15800 },
  { month: "Jul 25", ltv: 79100, cac: 15400 },
  { month: "Aug 25", ltv: 79800, cac: 15100 },
  { month: "Sep 25", ltv: 80500, cac: 14900 },
  { month: "Oct 25", ltv: 81200, cac: 14500 },
  { month: "Nov 25", ltv: 81900, cac: 14200 },
  { month: "Dec 25", ltv: 82400, cac: 14000 },
  { month: "Jan 26", ltv: 83100, cac: 13800 },
  { month: "Feb 26", ltv: 83600, cac: 13700 },
  { month: "Mar 26", ltv: 84200, cac: 13500 },
  { month: "Apr 26", ltv: 85000, cac: 13300 },
  { month: "May 26", ltv: 85700, cac: 13200 },
]

export const baselineTrajectoryData: BaselineTrajectoryPoint[] = [
  { week: "W1",  cash: 125000 },
  { week: "W2",  cash: 118000 },
  { week: "W3",  cash: 112000 },
  { week: "W4",  cash: 107000 },
  { week: "W5",  cash: 99000 },
  { week: "W6",  cash: 94000 },
  { week: "W7",  cash: 88000 },
  { week: "W8",  cash: 82000 },
  { week: "W9",  cash: 78000, projected: 78000 },
  { week: "W10", projected: 73000 },
  { week: "W11", projected: 69000 },
  { week: "W12", projected: 65000 },
  { week: "W13", projected: 62000 },
]

export const pipelineOpportunities: PipelineOpportunity[] = [
  { id: "po_01", clientName: "Apex Studios",    value: 8500,  probability: 85, type: "Expansion" },
  { id: "po_02", clientName: "Drift Marketing", value: 5000,  probability: 70, type: "Expansion" },
  { id: "po_03", clientName: "Horizon Tech",    value: 12000, probability: 50, type: "New Logo" },
  { id: "po_04", clientName: "Vertex Labs",     value: 3200,  probability: 30, type: "Renewal" },
  { id: "po_05", clientName: "Northwind Group", value: 6800,  probability: 15, type: "New Logo" },
]

// --- Scorecard Bridge Data ---

export const aprilRevenueBridge: BridgeStep[] = [
  { label: "Starting MRR", value: 38000, type: "start" },
  { label: "Expansion", value: 12000, type: "add", details: [
    { label: "Acme Co upsell", amount: 5000 },
    { label: "Meridian scope increase", amount: 4000 },
    { label: "Atlas new retainer", amount: 3000 },
  ]},
  { label: "Contraction", value: -8500, type: "subtract", details: [
    { label: "Prism scope reduction", amount: 3500 },
    { label: "Cobalt Outdoor churn", amount: 4200 },
    { label: "Sundial downgrade", amount: 800 },
  ]},
  { label: "Ending MRR", value: 41500, type: "end" },
]

export const aprilCashBridge: BridgeStep[] = [
  { label: "Starting Cash", value: 214900, type: "start" },
  { label: "Client Inflows", value: 45800, type: "add", details: [
    { label: "Retainer collections", amount: 38000 },
    { label: "Project payments", amount: 7800 },
  ]},
  { label: "Payroll", value: -31000, type: "subtract" },
  { label: "Software", value: -4200, type: "subtract" },
  { label: "Other OpEx", value: -2700, type: "subtract" },
  { label: "Ending Cash", value: 222800, type: "end" },
]

export const annual2025RevenueBridge: BridgeStep[] = [
  { label: "Starting MRR (Jan)", value: 32000, type: "start" },
  { label: "New Logos", value: 28000, type: "add", details: [
    { label: "Meridian Creative", amount: 8500 },
    { label: "Atlas Digital", amount: 7000 },
    { label: "Prism Agency", amount: 6500 },
    { label: "Other new clients", amount: 6000 },
  ]},
  { label: "Expansion", value: 18200, type: "add", details: [
    { label: "Acme Co retainer increase", amount: 6200 },
    { label: "Cobalt Outdoor upsell", amount: 5000 },
    { label: "Other expansions", amount: 7000 },
  ]},
  { label: "Churn", value: -34000, type: "subtract", details: [
    { label: "Sundial exit", amount: 12000 },
    { label: "Vertex Labs pause", amount: 9500 },
    { label: "Other churn", amount: 12500 },
  ]},
  { label: "Ending MRR (Dec)", value: 44200, type: "end" },
]

export const annual2025CashBridge: BridgeStep[] = [
  { label: "Starting Cash (Jan)", value: 180800, type: "start" },
  { label: "Client Inflows", value: 499200, type: "add", details: [
    { label: "Retainer revenue", amount: 412000 },
    { label: "Project revenue", amount: 87200 },
  ]},
  { label: "Payroll", value: -250000, type: "subtract" },
  { label: "Software & Tools", value: -89000, type: "subtract" },
  { label: "Other OpEx", value: -118200, type: "subtract" },
  { label: "Ending Cash (Dec)", value: 222800, type: "end" },
]

export const annual2026RevenueBridge: BridgeStep[] = [
  { label: "Starting MRR (Jan)", value: 44200, type: "start" },
  { label: "New Logos", value: 8500, type: "add", details: [
    { label: "Horizon Tech (Mar)", amount: 5500 },
    { label: "Drift Marketing (Apr)", amount: 3000 },
  ]},
  { label: "Expansion", value: 14800, type: "add", details: [
    { label: "Acme Co scope growth", amount: 6800 },
    { label: "Meridian upsell", amount: 4000 },
    { label: "Atlas retainer bump", amount: 4000 },
  ]},
  { label: "Churn", value: -12000, type: "subtract", details: [
    { label: "Cobalt Outdoor exit", amount: 8000 },
    { label: "Sundial final wind-down", amount: 4000 },
  ]},
  { label: "Ending MRR (Apr)", value: 55500, type: "end" },
]

export const annual2026CashBridge: BridgeStep[] = [
  { label: "Starting Cash (Jan)", value: 222800, type: "start" },
  { label: "Client Inflows", value: 155500, type: "add", details: [
    { label: "Retainer revenue", amount: 132000 },
    { label: "Project revenue", amount: 23500 },
  ]},
  { label: "Payroll", value: -92000, type: "subtract" },
  { label: "Software & Tools", value: -28400, type: "subtract" },
  { label: "Other OpEx", value: -21100, type: "subtract" },
  { label: "Ending Cash (Apr)", value: 236800, type: "end" },
]
