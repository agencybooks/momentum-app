import type { Client, Invoice, Transaction, MetricAnchor, Alert, ScorecardMonth, ClientMrrSnapshot, ClientMrrTrendPoint, ClientMarginTrendPoint, LivePulseData, SnapshotLedgerEntry, AntiPnLSnapshot } from './types';

// ---------------------------------------------------------------------------
// CLIENTS — 10 clients, ~$40K total MRR
// Acme Co ≈ 33% of total revenue. Cobalt Outdoor is At Risk.
// ---------------------------------------------------------------------------

export const clients: Client[] = [
  { id: 'cl_01', name: 'Acme Co',             mrr: 13200, tenure_months: 36, margin: 0.62, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_02', name: 'Cobalt Outdoor',      mrr: 4200,  tenure_months: 8,  margin: 0.41, status: 'At Risk',  hasTimeTracking: false },
  { id: 'cl_03', name: 'Meridian Health',      mrr: 5100,  tenure_months: 24, margin: 0.58, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_04', name: 'Prism Studios',        mrr: 3400,  tenure_months: 18, margin: 0.55, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_05', name: 'TerraVerde Farms',     mrr: 2800,  tenure_months: 14, margin: 0.49, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_06', name: 'Nightfall Media',      mrr: 3100,  tenure_months: 22, margin: 0.52, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_07', name: 'Atlas Fintech',        mrr: 2600,  tenure_months: 10, margin: 0.60, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_08', name: 'Bloom & Branch',       mrr: 1900,  tenure_months: 6,  margin: 0.44, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_09', name: 'Ironclad Legal',       mrr: 2200,  tenure_months: 30, margin: 0.57, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_10', name: 'Sundial Analytics',    mrr: 1500,  tenure_months: 4,  margin: 0.38, status: 'Healthy',  hasTimeTracking: false },
  { id: 'cl_11', name: 'Redwood Analytics',   mrr: 0,     tenure_months: 12, margin: 0,    status: 'Churned',  hasTimeTracking: false },
];
// Total MRR = 40,000 | Acme Co = 13,200 → 33.0%

// ---------------------------------------------------------------------------
// CLIENT PRIOR MRR — previous month MRR per client (for NRR / churn calcs)
// ---------------------------------------------------------------------------

export const clientPriorMrr: Record<string, number> = {
  cl_01: 12800,  // Acme grew +400
  cl_02: 4500,   // Cobalt contracted -300
  cl_03: 5100,   // Meridian flat
  cl_04: 3200,   // Prism grew +200
  cl_05: 2800,   // TerraVerde flat
  cl_06: 3000,   // Nightfall grew +100
  cl_07: 2600,   // Atlas flat
  cl_08: 1700,   // Bloom grew +200
  cl_09: 2200,   // Ironclad flat
  cl_10: 1500,   // Sundial flat
  cl_11: 2400,   // Redwood churned (was $2.4K)
};

// ---------------------------------------------------------------------------
// CLIENT MRR HISTORY — trailing 3-month snapshots for churn waterfall
// ---------------------------------------------------------------------------

export const clientMrrHistory: ClientMrrSnapshot[] = [
  {
    month: "Mar '26",
    mrr: 38400,
    gains: 1500,
    losses: -2700,
    details: [
      { name: 'Acme Co', amount: 400 },
      { name: 'Prism Studios', amount: 200 },
      { name: 'Bloom & Branch', amount: 200 },
      { name: 'Nightfall Media', amount: 100 },
      { name: 'Atlas Fintech', amount: 600 },
      { name: 'Cobalt Outdoor', amount: -300 },
      { name: 'Redwood Analytics', amount: -2400 },
    ],
  },
  {
    month: "Apr '26",
    mrr: 39500,
    gains: 1400,
    losses: -300,
    details: [
      { name: 'Acme Co', amount: 400 },
      { name: 'Prism Studios', amount: 200 },
      { name: 'Nightfall Media', amount: 100 },
      { name: 'Bloom & Branch', amount: 200 },
      { name: 'Atlas Fintech', amount: 500 },
      { name: 'Cobalt Outdoor', amount: -300 },
    ],
  },
  {
    month: "May '26",
    mrr: 40000,
    gains: 900,
    losses: -400,
    details: [
      { name: 'Acme Co', amount: 400 },
      { name: 'Prism Studios', amount: 200 },
      { name: 'Nightfall Media', amount: 100 },
      { name: 'Bloom & Branch', amount: 200 },
      { name: 'Cobalt Outdoor', amount: -300 },
      { name: 'Sundial Analytics', amount: -100 },
    ],
  },
];

export const clientMrrTrend: ClientMrrTrendPoint[] = [
  { month: "Dec", totalMrr: 36800 },
  { month: "Jan", totalMrr: 37500 },
  { month: "Feb", totalMrr: 38200 },
  { month: "Mar", totalMrr: 38400 },
  { month: "Apr", totalMrr: 39500 },
  { month: "May", totalMrr: 40000 },
]

export const clientMarginTrend: ClientMarginTrendPoint[] = [
  { month: "Dec", blendedMargin: 0.508 },
  { month: "Jan", blendedMargin: 0.514 },
  { month: "Feb", blendedMargin: 0.520 },
  { month: "Mar", blendedMargin: 0.532 },
  { month: "Apr", blendedMargin: 0.540 },
  { month: "May", blendedMargin: 0.548 },
]

// ---------------------------------------------------------------------------
// INVOICES
// Cobalt Outdoor has a $25K invoice 75 days overdue (due 2026-02-22).
// ---------------------------------------------------------------------------

export const invoices: Invoice[] = [
  // Acme Co — healthy, paid
  { id: 'inv_01', clientId: 'cl_01', invoiceNumber: 'INV-1001', amount: 13200, dueDate: '2026-04-01', status: 'Paid',    daysOverdue: 0 },
  { id: 'inv_02', clientId: 'cl_01', invoiceNumber: 'INV-1002', amount: 13200, dueDate: '2026-05-01', status: 'Paid',    daysOverdue: 0 },

  // Cobalt Outdoor — critical overdue
  { id: 'inv_03', clientId: 'cl_02', invoiceNumber: 'INV-2001', amount: 25000, dueDate: '2026-02-22', status: 'Overdue', daysOverdue: 75 },
  { id: 'inv_04', clientId: 'cl_02', invoiceNumber: 'INV-2002', amount: 4200,  dueDate: '2026-05-01', status: 'Open',    daysOverdue: 0 },

  // Meridian Health
  { id: 'inv_05', clientId: 'cl_03', invoiceNumber: 'INV-3001', amount: 5100,  dueDate: '2026-04-15', status: 'Paid',    daysOverdue: 0 },
  { id: 'inv_06', clientId: 'cl_03', invoiceNumber: 'INV-3002', amount: 5100,  dueDate: '2026-05-15', status: 'Open',    daysOverdue: 0 },

  // Prism Studios
  { id: 'inv_07', clientId: 'cl_04', invoiceNumber: 'INV-4001', amount: 3400,  dueDate: '2026-04-10', status: 'Paid',    daysOverdue: 0 },

  // TerraVerde Farms — slightly overdue
  { id: 'inv_08', clientId: 'cl_05', invoiceNumber: 'INV-5001', amount: 2800,  dueDate: '2026-04-28', status: 'Overdue', daysOverdue: 10 },

  // Nightfall Media
  { id: 'inv_09', clientId: 'cl_06', invoiceNumber: 'INV-6001', amount: 3100,  dueDate: '2026-05-05', status: 'Open',    daysOverdue: 0 },

  // Atlas Fintech
  { id: 'inv_10', clientId: 'cl_07', invoiceNumber: 'INV-7001', amount: 2600,  dueDate: '2026-04-20', status: 'Paid',    daysOverdue: 0 },

  // Bloom & Branch
  { id: 'inv_11', clientId: 'cl_08', invoiceNumber: 'INV-8001', amount: 1900,  dueDate: '2026-05-10', status: 'Open',    daysOverdue: 0 },

  // Ironclad Legal
  { id: 'inv_12', clientId: 'cl_09', invoiceNumber: 'INV-9001', amount: 2200,  dueDate: '2026-04-25', status: 'Paid',    daysOverdue: 0 },

  // Sundial Analytics — overdue
  { id: 'inv_13', clientId: 'cl_10', invoiceNumber: 'INV-1010', amount: 1500,  dueDate: '2026-04-22', status: 'Overdue', daysOverdue: 16 },

  // --- Additional invoices for scroll density & bucket coverage ---

  // Current (daysOverdue = 0)
  { id: 'inv_14', clientId: 'cl_01', invoiceNumber: 'INV-1003', amount: 14800, dueDate: '2026-05-15', status: 'Open',    daysOverdue: 0 },
  { id: 'inv_15', clientId: 'cl_04', invoiceNumber: 'INV-4002', amount: 6250,  dueDate: '2026-05-18', status: 'Open',    daysOverdue: 0 },
  { id: 'inv_16', clientId: 'cl_07', invoiceNumber: 'INV-7002', amount: 3800,  dueDate: '2026-05-20', status: 'Open',    daysOverdue: 0 },
  { id: 'inv_17', clientId: 'cl_10', invoiceNumber: 'INV-1011', amount: 1850,  dueDate: '2026-05-14', status: 'Open',    daysOverdue: 0 },

  // 1-30 Days overdue
  { id: 'inv_18', clientId: 'cl_01', invoiceNumber: 'INV-1004', amount: 11500, dueDate: '2026-04-29', status: 'Overdue', daysOverdue: 12 },
  { id: 'inv_19', clientId: 'cl_03', invoiceNumber: 'INV-3003', amount: 4750,  dueDate: '2026-04-19', status: 'Overdue', daysOverdue: 22 },
  { id: 'inv_20', clientId: 'cl_06', invoiceNumber: 'INV-6002', amount: 2900,  dueDate: '2026-04-13', status: 'Overdue', daysOverdue: 28 },

  // 31-60 Days overdue
  { id: 'inv_21', clientId: 'cl_04', invoiceNumber: 'INV-4003', amount: 7200,  dueDate: '2026-03-28', status: 'Overdue', daysOverdue: 44 },
  { id: 'inv_22', clientId: 'cl_05', invoiceNumber: 'INV-5002', amount: 3600,  dueDate: '2026-03-19', status: 'Overdue', daysOverdue: 53 },
  { id: 'inv_23', clientId: 'cl_09', invoiceNumber: 'INV-9002', amount: 5400,  dueDate: '2026-04-03', status: 'Overdue', daysOverdue: 38 },

  // 60+ Days overdue
  { id: 'inv_24', clientId: 'cl_07', invoiceNumber: 'INV-7003', amount: 1950,  dueDate: '2026-03-01', status: 'Overdue', daysOverdue: 71 },
  { id: 'inv_25', clientId: 'cl_08', invoiceNumber: 'INV-8002', amount: 1200,  dueDate: '2026-03-07', status: 'Overdue', daysOverdue: 65 },
];

// ---------------------------------------------------------------------------
// TRANSACTIONS
// Gusto $31K payroll outflow on 2026-05-12 (4 days from today).
// AWS transaction with +40% variance to prior.
// ---------------------------------------------------------------------------

export const transactions: Transaction[] = [
  // Inflows (client payments received)
  { id: 'tx_01', date: '2026-05-01', amount: 13200, vendor: 'Acme Co',          category: 'Client Payment', type: 'Inflow',  varianceToPrior: '+0%' },
  { id: 'tx_02', date: '2026-04-28', amount: 5100,  vendor: 'Meridian Health',  category: 'Client Payment', type: 'Inflow',  varianceToPrior: '+0%' },
  { id: 'tx_03', date: '2026-04-25', amount: 3400,  vendor: 'Prism Studios',    category: 'Client Payment', type: 'Inflow',  varianceToPrior: '+0%' },
  { id: 'tx_04', date: '2026-04-20', amount: 2600,  vendor: 'Atlas Fintech',    category: 'Client Payment', type: 'Inflow',  varianceToPrior: '+0%' },
  { id: 'tx_05', date: '2026-04-25', amount: 2200,  vendor: 'Ironclad Legal',   category: 'Client Payment', type: 'Inflow',  varianceToPrior: '+0%' },

  // Outflows — operating expenses
  { id: 'tx_06', date: '2026-05-12', amount: 31000, vendor: 'Gusto',            category: 'Payroll',        type: 'Outflow', varianceToPrior: '+3%' },
  { id: 'tx_07', date: '2026-05-03', amount: 4200,  vendor: 'AWS',              category: 'Infrastructure', type: 'Outflow', varianceToPrior: '+40%' },
  { id: 'tx_08', date: '2026-05-01', amount: 1200,  vendor: 'Figma',            category: 'Software',       type: 'Outflow', varianceToPrior: '+0%' },
  { id: 'tx_09', date: '2026-04-30', amount: 850,   vendor: 'Slack',            category: 'Software',       type: 'Outflow', varianceToPrior: '-5%' },
  { id: 'tx_10', date: '2026-04-28', amount: 2400,  vendor: 'WeWork',           category: 'Office',         type: 'Outflow', varianceToPrior: '+0%' },
  { id: 'tx_11', date: '2026-05-05', amount: 650,   vendor: 'Google Workspace', category: 'Software',       type: 'Outflow', varianceToPrior: '+0%' },
  { id: 'tx_12', date: '2026-04-29', amount: 1800,  vendor: 'Blue Cross',       category: 'Benefits',       type: 'Outflow', varianceToPrior: '+2%' },
];

// ---------------------------------------------------------------------------
// METRIC ANCHORS — top-level KPIs for the dashboard
// ---------------------------------------------------------------------------

export const metricAnchors: MetricAnchor[] = [
  { id: 'ma_01', title: 'Monthly Recurring Revenue', value: 40000,  target: 45000,  isHealthy: false, trendUp: true, trendText: '+2.3% vs prior month' },
  { id: 'ma_02', title: 'Net Margin',                value: 0.54,   target: 0.60,   isHealthy: false, trendText: '-1.2pp vs prior month' },
  { id: 'ma_03', title: 'Cash Runway',               value: 4.8,    target: 6.0,    isHealthy: false, trendText: '-0.4 months vs prior' },
  { id: 'ma_04', title: 'A/R Aging (>60 days)',       value: 28150,  target: 0,      isHealthy: false, trendText: '$28.2K overdue >60 days' },
  { id: 'ma_05', title: 'Revenue Concentration',      value: 0.33,   target: 0.20,   isHealthy: false, trendText: 'Acme Co = 33% of MRR' },
  { id: 'ma_06', title: 'Client Count',               value: 10,     target: 12,     isHealthy: true,  trendText: '+1 vs prior month' },
];

// ---------------------------------------------------------------------------
// ALERTS — derived from the seeded anomalies
// ---------------------------------------------------------------------------

export const alerts: Alert[] = [
  {
    id: 'al_01',
    title: 'Revenue Concentration Risk',
    message: 'Acme Co represents 33% of total MRR ($13,200 / $40,000). Losing this client would be catastrophic.',
    type: 'critical',
    linkTo: '/clients',
    drawerTrigger: 'revenue-concentration',
  },
  {
    id: 'al_02',
    title: 'Overdue Invoice — Cobalt Outdoor',
    message: 'INV-2001 for $25,000 is 75 days overdue. Client is marked At Risk. Escalate collections immediately.',
    type: 'critical',
    linkTo: '/cash',
    drawerTrigger: 'ar-intelligence',
  },
  {
    id: 'al_03',
    title: 'Payroll Due in 4 Days',
    message: '$31,000 Gusto payroll hits on May 12. Confirm cash position covers this outflow.',
    type: 'warning',
    linkTo: '/cash',
    drawerTrigger: 'cash-runway',
  },
  {
    id: 'al_04',
    title: 'AWS Cost Spike',
    message: 'AWS infrastructure spend is up 40% vs prior period ($4,200). Investigate usage anomaly.',
    type: 'warning',
    linkTo: '/profitability',
    drawerTrigger: 'category-dive',
  },
];

// ---------------------------------------------------------------------------
// RECENT SCORECARDS — 3 most recent months for the dashboard footer
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// CLIENT UNIT ECONOMICS — per-client cost breakdown for profitability diagnostic
// Derived from margin: labor ≈ 65% of costs, software ≈ 25%, remainder = overhead
// ---------------------------------------------------------------------------

export const clientUnitEconomics: Record<string, { directLaborCost: number; softwareAdSpend: number }> = {
  cl_01: { directLaborCost: 3260, softwareAdSpend: 1254 },  // Acme: 38% cost → $5,016 total cost
  cl_02: { directLaborCost: 1612, softwareAdSpend: 620 },   // Cobalt: 59% cost → $2,478 total
  cl_03: { directLaborCost: 1393, softwareAdSpend: 535 },   // Meridian: 42% cost → $2,142 total
  cl_04: { directLaborCost: 995,  softwareAdSpend: 382 },   // Prism: 45% cost → $1,530 total
  cl_05: { directLaborCost: 928,  softwareAdSpend: 357 },   // TerraVerde: 51% cost → $1,428 total
  cl_06: { directLaborCost: 967,  softwareAdSpend: 372 },   // Nightfall: 48% cost → $1,488 total
  cl_07: { directLaborCost: 676,  softwareAdSpend: 260 },   // Atlas: 40% cost → $1,040 total
  cl_08: { directLaborCost: 692,  softwareAdSpend: 266 },   // Bloom: 56% cost → $1,064 total
  cl_09: { directLaborCost: 615,  softwareAdSpend: 236 },   // Ironclad: 43% cost → $946 total
  cl_10: { directLaborCost: 605,  softwareAdSpend: 232 },   // Sundial: 62% cost → $930 total
  cl_11: { directLaborCost: 0,    softwareAdSpend: 0 },     // Redwood: churned
};

// ---------------------------------------------------------------------------
// CLIENT MARGIN TREND (90-DAY) — 3 monthly snapshots per client for sparkline
// Stories: Cobalt declining, Sundial recovering, Acme stable
// ---------------------------------------------------------------------------

export const clientMarginTrend90d: Record<string, { month: string; margin: number }[]> = {
  cl_01: [{ month: 'Mar', margin: 0.61 }, { month: 'Apr', margin: 0.61 }, { month: 'May', margin: 0.62 }],
  cl_02: [{ month: 'Mar', margin: 0.47 }, { month: 'Apr', margin: 0.44 }, { month: 'May', margin: 0.41 }],
  cl_03: [{ month: 'Mar', margin: 0.56 }, { month: 'Apr', margin: 0.57 }, { month: 'May', margin: 0.58 }],
  cl_04: [{ month: 'Mar', margin: 0.54 }, { month: 'Apr', margin: 0.55 }, { month: 'May', margin: 0.55 }],
  cl_05: [{ month: 'Mar', margin: 0.50 }, { month: 'Apr', margin: 0.49 }, { month: 'May', margin: 0.49 }],
  cl_06: [{ month: 'Mar', margin: 0.51 }, { month: 'Apr', margin: 0.52 }, { month: 'May', margin: 0.52 }],
  cl_07: [{ month: 'Mar', margin: 0.58 }, { month: 'Apr', margin: 0.59 }, { month: 'May', margin: 0.60 }],
  cl_08: [{ month: 'Mar', margin: 0.42 }, { month: 'Apr', margin: 0.43 }, { month: 'May', margin: 0.44 }],
  cl_09: [{ month: 'Mar', margin: 0.56 }, { month: 'Apr', margin: 0.57 }, { month: 'May', margin: 0.57 }],
  cl_10: [{ month: 'Mar', margin: 0.35 }, { month: 'Apr', margin: 0.36 }, { month: 'May', margin: 0.38 }],
  cl_11: [],
};

// ---------------------------------------------------------------------------
// PER-CLIENT MRR HISTORY — 8-month trajectory for step chart in profile drawer
// Stories: Acme steady growth, Cobalt declining, Bloom ramping, Redwood churned
// ---------------------------------------------------------------------------

export const clientMrrHistoryPerClient: Record<string, { month: string; mrr: number }[]> = {
  cl_01: [
    { month: "Oct '25", mrr: 11000 },
    { month: "Nov '25", mrr: 11000 },
    { month: "Dec '25", mrr: 12000 },
    { month: "Jan '26", mrr: 12000 },
    { month: "Feb '26", mrr: 12800 },
    { month: "Mar '26", mrr: 12800 },
    { month: "Apr '26", mrr: 13200 },
    { month: "May '26", mrr: 13200 },
  ],
  cl_02: [
    { month: "Oct '25", mrr: 5200 },
    { month: "Nov '25", mrr: 5200 },
    { month: "Dec '25", mrr: 5000 },
    { month: "Jan '26", mrr: 5000 },
    { month: "Feb '26", mrr: 4800 },
    { month: "Mar '26", mrr: 4500 },
    { month: "Apr '26", mrr: 4200 },
    { month: "May '26", mrr: 4200 },
  ],
  cl_03: [
    { month: "Oct '25", mrr: 4500 },
    { month: "Nov '25", mrr: 4500 },
    { month: "Dec '25", mrr: 4800 },
    { month: "Jan '26", mrr: 4800 },
    { month: "Feb '26", mrr: 5100 },
    { month: "Mar '26", mrr: 5100 },
    { month: "Apr '26", mrr: 5100 },
    { month: "May '26", mrr: 5100 },
  ],
  cl_04: [
    { month: "Oct '25", mrr: 2800 },
    { month: "Nov '25", mrr: 2800 },
    { month: "Dec '25", mrr: 3000 },
    { month: "Jan '26", mrr: 3000 },
    { month: "Feb '26", mrr: 3200 },
    { month: "Mar '26", mrr: 3200 },
    { month: "Apr '26", mrr: 3400 },
    { month: "May '26", mrr: 3400 },
  ],
  cl_05: [
    { month: "Oct '25", mrr: 2500 },
    { month: "Nov '25", mrr: 2500 },
    { month: "Dec '25", mrr: 2500 },
    { month: "Jan '26", mrr: 2800 },
    { month: "Feb '26", mrr: 2800 },
    { month: "Mar '26", mrr: 2800 },
    { month: "Apr '26", mrr: 2800 },
    { month: "May '26", mrr: 2800 },
  ],
  cl_06: [
    { month: "Oct '25", mrr: 2600 },
    { month: "Nov '25", mrr: 2600 },
    { month: "Dec '25", mrr: 2800 },
    { month: "Jan '26", mrr: 2800 },
    { month: "Feb '26", mrr: 3000 },
    { month: "Mar '26", mrr: 3000 },
    { month: "Apr '26", mrr: 3100 },
    { month: "May '26", mrr: 3100 },
  ],
  cl_07: [
    { month: "Oct '25", mrr: 1800 },
    { month: "Nov '25", mrr: 1800 },
    { month: "Dec '25", mrr: 2000 },
    { month: "Jan '26", mrr: 2000 },
    { month: "Feb '26", mrr: 2200 },
    { month: "Mar '26", mrr: 2600 },
    { month: "Apr '26", mrr: 2600 },
    { month: "May '26", mrr: 2600 },
  ],
  cl_08: [
    { month: "Oct '25", mrr: 0 },
    { month: "Nov '25", mrr: 0 },
    { month: "Dec '25", mrr: 1200 },
    { month: "Jan '26", mrr: 1200 },
    { month: "Feb '26", mrr: 1500 },
    { month: "Mar '26", mrr: 1700 },
    { month: "Apr '26", mrr: 1900 },
    { month: "May '26", mrr: 1900 },
  ],
  cl_09: [
    { month: "Oct '25", mrr: 2200 },
    { month: "Nov '25", mrr: 2200 },
    { month: "Dec '25", mrr: 2200 },
    { month: "Jan '26", mrr: 2200 },
    { month: "Feb '26", mrr: 2200 },
    { month: "Mar '26", mrr: 2200 },
    { month: "Apr '26", mrr: 2200 },
    { month: "May '26", mrr: 2200 },
  ],
  cl_10: [
    { month: "Oct '25", mrr: 0 },
    { month: "Nov '25", mrr: 0 },
    { month: "Dec '25", mrr: 0 },
    { month: "Jan '26", mrr: 0 },
    { month: "Feb '26", mrr: 1500 },
    { month: "Mar '26", mrr: 1500 },
    { month: "Apr '26", mrr: 1500 },
    { month: "May '26", mrr: 1500 },
  ],
  cl_11: [
    { month: "Oct '25", mrr: 2400 },
    { month: "Nov '25", mrr: 2400 },
    { month: "Dec '25", mrr: 2400 },
    { month: "Jan '26", mrr: 2400 },
    { month: "Feb '26", mrr: 2400 },
    { month: "Mar '26", mrr: 0 },
    { month: "Apr '26", mrr: 0 },
    { month: "May '26", mrr: 0 },
  ],
};

// ---------------------------------------------------------------------------
// CLIENT AVG DAYS TO PAY — average payment speed per client
// ---------------------------------------------------------------------------

export const clientAvgDaysToPay: Record<string, number> = {
  cl_01: 12,
  cl_02: 45,
  cl_03: 18,
  cl_04: 14,
  cl_05: 22,
  cl_06: 16,
  cl_07: 10,
  cl_08: 20,
  cl_09: 8,
  cl_10: 35,
  cl_11: 0,
};

export const recentScorecards: ScorecardMonth[] = [
  {
    month: 'April 2026',
    isCurrent: true,
    revenue: 41500,
    revenueTrend: '↑ 9%',
    grossMarginPct: 50.1,
    grossMarginTrend: '↑ 1.8 pts',
    netIncome: 7900,
    netIncomeTrend: '↑ 4.2%',
    href: '/scorecards?drawer=anti-pnl-snapshot&period=april-2026',
  },
  {
    month: 'March 2026',
    isCurrent: false,
    revenue: 38100,
    revenueTrend: '↑ 4.4%',
    grossMarginPct: 48.3,
    grossMarginTrend: '↑ 1.6 pts',
    netIncome: 6200,
    netIncomeTrend: '↑ 3.8%',
    href: '/scorecards?drawer=anti-pnl-snapshot&period=march-2026',
  },
  {
    month: 'February 2026',
    isCurrent: false,
    revenue: 36500,
    revenueTrend: '↑ 3.2%',
    grossMarginPct: 46.7,
    grossMarginTrend: '↑ 1.1 pts',
    netIncome: 5400,
    netIncomeTrend: '↑ 2.1%',
    href: '/scorecards?drawer=anti-pnl-snapshot&period=february-2026',
  },
];

// ---------------------------------------------------------------------------
// Strategic CFO Scorecards — Live Pulse + Snapshot Ledger + Anti-P&L
// ---------------------------------------------------------------------------

export const livePulseData: LivePulseData = {
  daysToClose: 14,
  cashRunwayMonths: 6.2,
  unmappedTransactions: 12,
};

export const snapshotLedger: SnapshotLedgerEntry[] = [
  {
    id: 'snap-apr-2026',
    period: 'April 2026',
    slug: 'april-2026',
    netMomentum: 3500,
    cashDelta: 7900,
    targetsHit: 8,
    targetsTotal: 13,
    isLocked: true,
  },
  {
    id: 'snap-mar-2026',
    period: 'March 2026',
    slug: 'march-2026',
    netMomentum: -1200,
    cashDelta: 3200,
    targetsHit: 6,
    targetsTotal: 13,
    isLocked: true,
  },
  {
    id: 'snap-feb-2026',
    period: 'February 2026',
    slug: 'february-2026',
    netMomentum: 2100,
    cashDelta: 5400,
    targetsHit: 7,
    targetsTotal: 13,
    isLocked: true,
  },
  {
    id: 'snap-jan-2026',
    period: 'January 2026',
    slug: 'january-2026',
    netMomentum: -800,
    cashDelta: 1900,
    targetsHit: 5,
    targetsTotal: 13,
    isLocked: true,
  },
];

export const antiPnlSnapshots: Record<string, AntiPnLSnapshot> = {
  'april-2026': {
    period: 'April 2026',
    slug: 'april-2026',
    executiveSummary: {
      insights: [
        'April saw strong cash generation but margin compression in the web division. NRR remained stable, though delayed payments are straining short-term liquidity.',
        'Revenue grew by $3.5K entirely through expansion — no new logos added this month.',
        'Gross margin improved to 50.1%, clearing the 50% floor for the first time in Q2.',
      ],
      topPriority: {
        label: 'Collect Overdue AR',
        detail: 'Halt Acme Co deliverables until their 56-day overdue invoice of $15k is collected. This single action recovers 42 days of DSO drift.',
      },
    },
    varianceDrift: true,
    driftMessage: 'Revenue figures adjusted +$800 after post-close reconciliation. Prior snapshot showed $40,700.',
    quadrants: {
      clientRev: {
        heroLabel: 'Net Revenue Retention',
        heroValue: '104%',
        heroTrend: 'up',
        secondaryLabel: 'Top Client Concentration',
        secondaryValue: '35%',
        warningThreshold: true,
      },
      growth: {
        heroLabel: 'Net Momentum',
        heroValue: '+$3,500',
        heroTrend: 'up',
        secondaryLabel: 'Logo vs MRR Churn',
        secondaryValue: '1 : $400',
        warningThreshold: false,
      },
      efficiency: {
        heroLabel: 'Blended Margin',
        heroValue: '42%',
        heroTrend: 'down',
        secondaryLabel: 'Margin Vampire',
        secondaryValue: 'SEO Retainers (18%)',
        warningThreshold: true,
      },
      liquidity: {
        heroLabel: 'Net Cash Yield',
        heroValue: '+$7,900',
        heroTrend: 'up',
        secondaryLabel: 'AR DSO',
        secondaryValue: '42 Days',
        warningThreshold: true,
      },
    },
    targetYield: {
      met: 8,
      total: 13,
      offTrack: [
        { metric: 'Net Profit Margin', actual: '16.4%', variance: '-3.6pp gap' },
        { metric: 'AR DSO', actual: '56 Days', variance: '+11d gap' },
        { metric: 'Top Client Concentration', actual: '33%', variance: '+8pp gap' },
        { metric: 'Cash Runway', actual: '5.4 mo', variance: '-0.6 mo gap' },
        { metric: 'Operating Margin', actual: '19.0%', variance: '-1.0pp gap' },
      ],
      onTrack: [
        { metric: 'Gross Margin', actual: '50.1%', variance: 'Cleared Floor' },
        { metric: 'NRR', actual: '105.1%', variance: '+5.1pp' },
        { metric: 'LER', actual: '2.10x', variance: '+0.10x' },
        { metric: 'Monthly Churn', actual: '0.9%', variance: '-4.1pp' },
        { metric: 'MRR', actual: '$40,000', variance: 'At Floor' },
        { metric: 'CAC Payback', actual: '8.5 mo', variance: '-3.5 mo' },
        { metric: 'LTV:CAC', actual: '6.5x', variance: '+3.5x' },
        { metric: 'Net Burn Rate', actual: '-$15.2K', variance: 'Below Ceiling' },
      ],
    },
  },
  'march-2026': {
    period: 'March 2026',
    slug: 'march-2026',
    executiveSummary: {
      insights: [
        'March showed early signs of margin pressure as contractor costs rose 12% while revenue grew only 4.4%.',
        'Cash position held steady due to timely collections, but two clients slipped past 30-day terms.',
        'NRR dipped below 100% for the first time since November, driven by Redwood Analytics churn.',
      ],
      topPriority: {
        label: 'Address Contractor Cost Overrun',
        detail: 'Web division contractor spend exceeded budget by $2.1K. Renegotiate rates or reduce scope on the Cobalt Outdoor retainer before April close.',
      },
    },
    varianceDrift: false,
    quadrants: {
      clientRev: {
        heroLabel: 'Net Revenue Retention',
        heroValue: '97%',
        heroTrend: 'down',
        secondaryLabel: 'Top Client Concentration',
        secondaryValue: '34%',
        warningThreshold: true,
      },
      growth: {
        heroLabel: 'Net Momentum',
        heroValue: '-$1,200',
        heroTrend: 'down',
        secondaryLabel: 'Logo vs MRR Churn',
        secondaryValue: '1 : $2,400',
        warningThreshold: true,
      },
      efficiency: {
        heroLabel: 'Blended Margin',
        heroValue: '39%',
        heroTrend: 'down',
        secondaryLabel: 'Margin Vampire',
        secondaryValue: 'Web Retainers (22%)',
        warningThreshold: true,
      },
      liquidity: {
        heroLabel: 'Net Cash Yield',
        heroValue: '+$3,200',
        heroTrend: 'up',
        secondaryLabel: 'AR DSO',
        secondaryValue: '38 Days',
        warningThreshold: false,
      },
    },
    targetYield: {
      met: 6,
      total: 13,
      offTrack: [
        { metric: 'Net Profit Margin', actual: '14.2%', variance: '-5.8pp gap' },
        { metric: 'NRR', actual: '97%', variance: '-3.0pp gap' },
        { metric: 'Top Client Concentration', actual: '34%', variance: '+9pp gap' },
        { metric: 'Cash Runway', actual: '5.1 mo', variance: '-0.9 mo gap' },
        { metric: 'Operating Margin', actual: '17.5%', variance: '-2.5pp gap' },
        { metric: 'Gross Margin', actual: '48.3%', variance: '-1.7pp gap' },
        { metric: 'Revenue per FTE', actual: '$164K', variance: '-$16K gap' },
      ],
      onTrack: [
        { metric: 'LER', actual: '2.05x', variance: '+0.05x' },
        { metric: 'Monthly Churn', actual: '1.2%', variance: '-3.8pp' },
        { metric: 'MRR', actual: '$38,400', variance: 'Near Floor' },
        { metric: 'CAC Payback', actual: '9.0 mo', variance: '-3.0 mo' },
        { metric: 'LTV:CAC', actual: '5.8x', variance: '+2.8x' },
        { metric: 'Net Burn Rate', actual: '-$12K', variance: 'Below Ceiling' },
      ],
    },
  },
};
