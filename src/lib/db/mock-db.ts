import type { Client, Invoice, Transaction, MetricAnchor, Alert } from './types';

// ---------------------------------------------------------------------------
// CLIENTS — 10 clients, ~$40K total MRR
// Acme Co ≈ 33% of total revenue. Cobalt Outdoor is At Risk.
// ---------------------------------------------------------------------------

export const clients: Client[] = [
  { id: 'cl_01', name: 'Acme Co',             mrr: 13200, tenure_months: 36, margin: 0.62, status: 'Healthy' },
  { id: 'cl_02', name: 'Cobalt Outdoor',      mrr: 4200,  tenure_months: 8,  margin: 0.41, status: 'At Risk' },
  { id: 'cl_03', name: 'Meridian Health',      mrr: 5100,  tenure_months: 24, margin: 0.58, status: 'Healthy' },
  { id: 'cl_04', name: 'Prism Studios',        mrr: 3400,  tenure_months: 18, margin: 0.55, status: 'Healthy' },
  { id: 'cl_05', name: 'TerraVerde Farms',     mrr: 2800,  tenure_months: 14, margin: 0.49, status: 'Healthy' },
  { id: 'cl_06', name: 'Nightfall Media',      mrr: 3100,  tenure_months: 22, margin: 0.52, status: 'Healthy' },
  { id: 'cl_07', name: 'Atlas Fintech',        mrr: 2600,  tenure_months: 10, margin: 0.60, status: 'Healthy' },
  { id: 'cl_08', name: 'Bloom & Branch',       mrr: 1900,  tenure_months: 6,  margin: 0.44, status: 'Healthy' },
  { id: 'cl_09', name: 'Ironclad Legal',       mrr: 2200,  tenure_months: 30, margin: 0.57, status: 'Healthy' },
  { id: 'cl_10', name: 'Sundial Analytics',    mrr: 1500,  tenure_months: 4,  margin: 0.38, status: 'Healthy' },
];
// Total MRR = 40,000 | Acme Co = 13,200 → 33.0%

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
  { id: 'ma_04', title: 'A/R Aging (>60 days)',       value: 25000,  target: 0,      isHealthy: false, trendText: '$25K overdue >60 days' },
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
