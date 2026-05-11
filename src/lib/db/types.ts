export interface Client {
  id: string;
  name: string;
  mrr: number;
  tenure_months: number;
  margin: number;
  status: 'Healthy' | 'At Risk';
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

export interface BaselineTrajectoryPoint {
  week: string
  cash?: number
  projected?: number
}
