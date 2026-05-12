export interface Client {
  id: string;
  name: string;
  mrr: number;
  tenure_months: number;
  margin: number;
  status: 'Healthy' | 'At Risk' | 'Churned';
  hasTimeTracking: boolean;
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

export interface ClientUnitEconomics {
  directLaborCost: number
  softwareAdSpend: number
  netClientProfit: number
  netMarginPct: number
}

export interface ClientMrrHistoryPoint {
  month: string
  mrr: number
}

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
  unitEconomics: ClientUnitEconomics
  marginTrend90d: { month: string; margin: number }[]
  profitRank: number
  totalInvoiced: number
  avgDaysToPay: number
  clientMrrHistory: ClientMrrHistoryPoint[]
}

export interface ClientMrrSnapshot {
  month: string
  mrr: number
  gains: number
  losses: number
  details: { name: string; amount: number }[]
}

export interface CohortRetainedMrr {
  year: number
  retainedMrr: number
  activeClientCount: number
}

export interface ClientMrrTrendPoint {
  month: string
  totalMrr: number
}

export interface ClientMarginTrendPoint {
  month: string
  blendedMargin: number
}

export interface ClientsPageData {
  clients: EnrichedClient[]
  totalMrr: number
  nrr: number
  grossMrrChurn: number
  topClientConcentration: number
  avgMarginLTV: number
  blendedGrossMargin: number
  topClientProfitConcentration: number
  mrrTrend: ClientMrrTrendPoint[]
  marginTrend: ClientMarginTrendPoint[]
  mrrHistory: ClientMrrSnapshot[]
  cohortRetainedMrr: CohortRetainedMrr[]
  alert: { title: string; message: string; type: 'critical' | 'warning' | 'success' } | null
}

// ---------------------------------------------------------------------------
// Calibration Page
// ---------------------------------------------------------------------------

export interface Integration {
  id: string
  name: string
  iconName: string
  status: 'connected' | 'syncing' | 'delayed' | 'disconnected'
  lastSync: string | null
  scoreWeight: number
}

export interface COAAccount {
  id: string
  accountNumber: string
  accountName: string
  ytdTotal: number
  group: string | null
  subCategory: string | null
  floatingAmount: number
}

export interface TeamMember {
  id: string
  name: string
  monthlyCost: number
  role: string
  allocations: { department: string; percent: number }[]
}

export interface SoftwareItem {
  id: string
  vendor: string
  trailing30DayCost: number
  category: 'overhead' | 'shared-delivery' | 'direct-client' | null
}

export interface FinancialTarget {
  id: string
  metric: string
  group: 'cash' | 'profitability' | 'efficiency' | 'growth'
  floor: number | null
  ceiling: number | null
  unit: '%' | '$' | 'months' | 'days' | 'x'
  currentValue: number
}

export interface CalibrationData {
  integrations: Integration[]
  coaAccounts: COAAccount[]
  unmappedTotal: number
  teamMembers: TeamMember[]
  softwareItems: SoftwareItem[]
  financialTargets: FinancialTarget[]
}

// ---------------------------------------------------------------------------
// Settings & Administration
// ---------------------------------------------------------------------------

export interface SettingsTeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Viewer"
  status: "Active" | "Invited"
  avatarUrl?: string
}

export interface BillingInvoice {
  id: string
  date: string
  amount: number
  status: "Paid" | "Pending" | "Failed"
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  theme: "light" | "dark" | "system"
  timezone: string
}

export interface SettingsData {
  profile: UserProfile
  team: SettingsTeamMember[]
  billing: {
    plan: { name: string; price: number; interval: string }
    paymentMethod: { last4: string; brand: string; expiry: string }
    invoices: BillingInvoice[]
  }
  notifications: {
    emailDigestDaily: boolean
    emailDigestWeekly: boolean
    slackConnected: boolean
  }
  security: {
    twoFactorEnabled: boolean
  }
}
