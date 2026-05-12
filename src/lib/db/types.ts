export interface Client {
  id: string;
  name: string;
  mrr: number;
  tenure_months: number;
  margin: number;
  status: 'Healthy' | 'At Risk' | 'Churned';
}

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Open' | 'Overdue';
  daysOverdue: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  vendor: string;
  category: string;
  type: 'Inflow' | 'Outflow';
  varianceToPrior: string;
}

export interface MetricAnchor {
  id: string;
  title: string;
  value: number;
  target: number;
  isHealthy: boolean;
  trendUp?: boolean;
  trendDirection?: 'up-is-good' | 'down-is-good';
  trendText: string;
}

export interface RevenueExpenseTimeline {
  [key: string]: string | number;
  date: string;
  revenue: number;
  expenses: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success';
  linkTo: string;
  drawerTrigger: string;
}

export interface CashFlowTimeline {
  [key: string]: string | number;
  date: string;
  cashBalance: number;
  netBurn: number;
}

export interface PnLLineItem {
  id: string;
  name: string;
  amount: number;
  isSubItem: boolean;
  isTotal?: boolean;
}

export interface PnLSubItem {
  id: string;
  name: string;
  amount: number;
  variance: { percent: number; direction: 'up' | 'flat' | 'down' };
  drawerId: string;
  revenueWeight: number;
}

export interface PnLCategory {
  id: string;
  name: string;
  amount: number;
  children: PnLSubItem[];
  isHighlight?: boolean;
  highlightColor?: 'brand' | 'emerald';
  variance?: { percent: number; direction: 'up' | 'flat' | 'down' };
}

export interface ExpenseVariance {
  id: string;
  category: 'COGS' | 'OPEX';
  name: string;
  amount: number;
  priorAmount: number;
  variancePercent: number;
  trend: 'up' | 'flat' | 'down';
}

export interface SpendVectorComponent {
  label: string;
  amount: number;
  drawerId: string;
}

export interface SpendVector {
  id: string;
  name: string;
  totalAmount: number;
  revenuePercent: number;
  variance: { percent: number; direction: 'up' | 'flat' | 'down' };
  components: SpendVectorComponent[];
}

export interface ProfitabilityData {
  metrics: MetricAnchor[];
  pnl: PnLLineItem[];
  pnlTree: PnLCategory[];
  expenses: ExpenseVariance[];
  spendVectors: SpendVector[];
  revenue: number;
}

export interface CashForecastPoint {
  week: string;
  cash: number;
  inflows?: number;
  outflows?: number;
}

export interface Payable {
  id: string;
  dueDate: string;
  vendor: string;
  amount: number;
  canDelay: boolean;
}

export interface ProfitabilityTrendPoint {
  month: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  operatingProfit: number;
  otherExpenses: number;
  netIncome: number;
  grossMargin: number;
  opMargin: number;
  netMargin: number;
  revPerFte: number;
}

export interface GrowthTrendPoint {
  month: string;
  nrr: number;
  blendedCac: number;
  cacPayback: number;
  ltvCacRatio: number;
}

export interface CashTrendPoint {
  month: string;
  totalCash: number;
  inflows: number;
  outflows: number;
  netBurn: number;
  runway: number;
  dso: number;
}

export interface UnitEconomicsPoint {
  month: string
  ltv: number
  cac: number
}

export interface PipelineOpportunity {
  id: string
  clientName: string
  value: number
  probability: number
  type: "New Logo" | "Expansion" | "Renewal"
}

export interface RenewalAtRisk {
  id: string
  clientName: string
  mrrValue: number
  daysUntilRenewal: number
  status: 'critical' | 'warning' | 'safe'
}

export interface BaselineTrajectoryPoint {
  week: string
  cash?: number
  projected?: number
}

export interface ARAgingBucket {
  label: string;
  amount: number;
}

export interface ARAgingSummary {
  buckets: ARAgingBucket[];
  totalOutstanding: number;
}

export interface ScorecardMonth {
  month: string;
  isCurrent: boolean;
  revenue: number;
  revenueTrend: string;
  grossMarginPct: number;
  grossMarginTrend: string;
  netIncome: number;
  netIncomeTrend: string;
  href: string;
}

export interface CashActionAlert {
  id: string
  severity: "critical" | "warning" | "info"
  headline: string
  body: string
  actionLabel: string
  actionDrawerId: string
  weekRef?: string
}

// ---------------------------------------------------------------------------
// Clients Page — enriched types
// ---------------------------------------------------------------------------

export interface EnrichedClient extends Client {
  displayStatus: 'Active' | 'At Risk' | 'Churned'
  priorMrr: number
  mrrChange: number
  revenue90d: number
  grossProfit: number
  marginLTV: number
  runwayImpact: number
  concentrationPct: number
  cohortYear: number
  riskTags: { label: string; variant: 'amber' | 'destructive' }[]
  shockTest: {
    revenueImpact: string
    annualizedImpact: string
    runwayBefore: string
    runwayAfter: string
    runwayDelta: string
    newTopClient: string
    newTopClientPct: string
  }
}

export interface ClientMrrSnapshot {
  month: string
  mrr: number
  gains: number
  losses: number
  details: { name: string; amount: number }[]
}

export interface CohortMargin {
  year: number
  avgMargin: number
  clientCount: number
  totalMrr: number
}

export interface ClientsPageData {
  clients: EnrichedClient[]
  totalMrr: number
  nrr: number
  grossMrrChurn: number
  topClientConcentration: number
  avgMarginLTV: number
  mrrHistory: ClientMrrSnapshot[]
  cohortMargins: CohortMargin[]
  alert: { title: string; message: string; type: 'critical' | 'warning' | 'success' } | null
}
