import type { Client, Invoice, Transaction, MetricAnchor, Alert, ARAgingSummary, ScorecardMonth, ClientsPageData, EnrichedClient, CalibrationData, SettingsData, LivePulseData, SnapshotLedgerEntry, AntiPnLSnapshot } from './types';
import { clients, invoices, transactions, metricAnchors, alerts, recentScorecards, clientPriorMrr, clientMrrHistory, clientUnitEconomics, clientMarginTrend90d, clientMrrHistoryPerClient, clientAvgDaysToPay, livePulseData, snapshotLedger, antiPnlSnapshots } from './mock-db';
import { integrations, coaAccounts, teamMembers, softwareItems, financialTargets } from './calibration-data';
import { settingsData } from './settings-data';
import {
  CASH_BALANCE, MONTHLY_OUTFLOW, CURRENT_RUNWAY,
  computeConcentrationPct, computeRevenue90d, computeGrossProfit,
  computeMarginLTV, computeAvgMarginLTV, computeRunwayImpact,
  computeNRR, computeGrossChurn, deriveRiskTagsWithMrrChange,
  computeShockTest, deriveCohortYear, computeCohortRetainedMrr,
} from '@/lib/client-metrics';

export const DEPARTMENT_ORDER = ['Delivery', 'Marketing', 'Sales', 'Admin'] as const;

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 300));
}

export async function getClients(): Promise<Client[]> {
  return delay(clients);
}

export async function getClient(id: string): Promise<Client | undefined> {
  return delay(clients.find((c) => c.id === id));
}

export async function getInvoices(): Promise<Invoice[]> {
  return delay(invoices);
}

export async function getOverdueInvoices(): Promise<Invoice[]> {
  return delay(invoices.filter((inv) => inv.status === 'Overdue'));
}

export async function getOpenInvoices(): Promise<Invoice[]> {
  return delay(invoices.filter((inv) => inv.status !== 'Paid'));
}

export async function getInvoicesByClient(clientId: string): Promise<Invoice[]> {
  return delay(invoices.filter((inv) => inv.clientId === clientId));
}

export async function getTransactions(): Promise<Transaction[]> {
  return delay(transactions);
}

export async function getAlerts(): Promise<Alert[]> {
  return delay(alerts);
}

export async function getMetricAnchors(): Promise<MetricAnchor[]> {
  return delay(metricAnchors);
}

export async function getCashData(): Promise<MetricAnchor[]> {
  return delay([
    { id: 'ma_cash', title: 'Total Cash', value: 125000, target: 200000, isHealthy: false, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-$98K vs Mar' },
    { id: 'ma_burn', title: 'Net Burn/Mo', value: -15200, target: -8000, isHealthy: false, trendUp: true, trendDirection: 'down-is-good' as const, trendText: '+$7.2K vs avg' },
    { id: 'ma_runway', title: 'Runway', value: 5.4, target: 6.0, isHealthy: false, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-0.6 mos vs prior' },
    { id: 'ma_dso', title: 'DSO (Days Sales Out)', value: 41, target: 45, isHealthy: false, trendUp: true, trendDirection: 'down-is-good' as const, trendText: '+3 days vs last mo' },
  ]);
}

export async function getFinancialTimeline(): Promise<import('./types').CashFlowTimeline[]> {
  const data: import('./types').CashFlowTimeline[] = [];
  let currentCash = 150000;

  // Generate 90 days of mock data
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some random noise
    const burn = 1000 + Math.random() * 5000;
    const inflow = Math.random() > 0.8 ? 15000 + Math.random() * 20000 : 0;

    currentCash = currentCash - burn + inflow;

    data.push({
      date: date.toISOString().split('T')[0],
      cashBalance: Math.round(currentCash),
      netBurn: Math.round(burn),
    });
  }

  return delay(data);
}

export async function getDashboardMetrics(): Promise<MetricAnchor[]> {
  return delay([
    { id: 'ma_cash', title: 'Total Cash', value: 125000, target: 200000, isHealthy: false, trendUp: true, trendDirection: 'up-is-good' as const, trendText: '+$12K vs prior' },
    { id: 'ma_burn', title: 'Net Burn', value: -15200, target: -8000, isHealthy: false, trendUp: true, trendDirection: 'down-is-good' as const, trendText: '+$7.2K vs avg' },
    { id: 'ma_runway', title: 'Runway', value: 5.4, target: 6.0, isHealthy: false, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-0.4 mos vs prior' },
    { id: 'ma_mrr', title: 'Total MRR', value: 32500, target: 40000, isHealthy: false, trendUp: true, trendDirection: 'up-is-good' as const, trendText: '+$2.8K vs prior' },
    { id: 'ma_margin', title: 'Gross Margin', value: 0.501, target: 0.60, isHealthy: false, trendUp: true, trendDirection: 'up-is-good' as const, trendText: '+2.0% vs prior' },
  ]);
}

export async function getRevenueExpenseTimeline(): Promise<import('./types').RevenueExpenseTimeline[]> {
  const data: import('./types').RevenueExpenseTimeline[] = [];
  const baseRevenue = 9500;
  const baseExpenses = 7500;

  for (let week = 1; week <= 12; week++) {
    const revenueVariance = Math.sin(week * 0.8) * 400 + (week > 6 ? 200 : 0);
    const expenseVariance = Math.cos(week * 0.6) * 300 + (week > 9 ? 150 : 0);

    data.push({
      date: `Week ${week}`,
      revenue: Math.round(baseRevenue + revenueVariance),
      expenses: Math.round(baseExpenses + expenseVariance),
    });
  }

  return delay(data);
}

export async function getProfitabilityTrend(): Promise<import('./types').ProfitabilityTrendPoint[]> {
  return delay([
    { month: "Dec", revenue: 48000, cogs: 22800, grossProfit: 25200, opex: 15200, operatingProfit: 10000, otherExpenses: 1430, netIncome: 8570, grossMargin: 0.525, opMargin: 0.208, netMargin: 0.179, revPerFte: 155000 },
    { month: "Jan", revenue: 49500, cogs: 23500, grossProfit: 26000, opex: 15600, operatingProfit: 10400, otherExpenses: 1430, netIncome: 8970, grossMargin: 0.525, opMargin: 0.210, netMargin: 0.181, revPerFte: 158200 },
    { month: "Feb", revenue: 51000, cogs: 24200, grossProfit: 26800, opex: 16000, operatingProfit: 10800, otherExpenses: 1430, netIncome: 9370, grossMargin: 0.525, opMargin: 0.212, netMargin: 0.184, revPerFte: 161000 },
    { month: "Mar", revenue: 52500, cogs: 25000, grossProfit: 27500, opex: 16400, operatingProfit: 11100, otherExpenses: 1430, netIncome: 9670, grossMargin: 0.524, opMargin: 0.211, netMargin: 0.184, revPerFte: 164300 },
    { month: "Apr", revenue: 53800, cogs: 26300, grossProfit: 27500, opex: 16200, operatingProfit: 11300, otherExpenses: 1430, netIncome: 9870, grossMargin: 0.511, opMargin: 0.210, netMargin: 0.183, revPerFte: 166800 },
    { month: "May", revenue: 55000, cogs: 27445, grossProfit: 27555, opex: 17105, operatingProfit: 10450, otherExpenses: 1430, netIncome: 9020, grossMargin: 0.501, opMargin: 0.190, netMargin: 0.164, revPerFte: 168500 },
  ]);
}

export async function getProfitabilityData(): Promise<import('./types').ProfitabilityData> {
  const revenue = 55000;
  return delay({
    revenue,
    metrics: [
      { id: 'ma_gross_margin', title: 'Gross Margin', value: 0.501, target: 0.50, isHealthy: true, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-1.2pp vs prior' },
      { id: 'ma_op_margin', title: 'Operating Margin', value: 0.190, target: 0.20, isHealthy: false, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-2.1pp vs prior' },
      { id: 'ma_net_margin', title: 'Net Profit Margin', value: 0.164, target: 0.20, isHealthy: false, trendUp: false, trendDirection: 'up-is-good' as const, trendText: '-3.0pp vs prior' },
      { id: 'ma_rev_per_fte', title: 'Revenue per FTE', value: 168500, target: 180000, isHealthy: false, trendUp: true, trendDirection: 'up-is-good' as const, trendText: '+$4,200 vs prior' },
    ],
    pnl: [
      { id: 'pnl_1', name: 'Total Revenue', amount: 55000, isSubItem: false, isTotal: true },
      { id: 'pnl_2', name: 'Client Retainers', amount: 45000, isSubItem: true },
      { id: 'pnl_3', name: 'One-off Projects', amount: 10000, isSubItem: true },

      { id: 'pnl_4', name: 'Cost of Goods Sold (COGS)', amount: -27445, isSubItem: false, isTotal: true },
      { id: 'pnl_5', name: 'Freelancer Fees', amount: -15500, isSubItem: true },
      { id: 'pnl_6', name: 'Hosting & Infrastructure', amount: -7245, isSubItem: true },
      { id: 'pnl_7', name: 'Software / Tools', amount: -4700, isSubItem: true },

      { id: 'pnl_8', name: 'Gross Profit', amount: 27555, isSubItem: false, isTotal: true },

      { id: 'pnl_9', name: 'Operating Expenses (OpEx)', amount: -17105, isSubItem: false, isTotal: true },
      { id: 'pnl_10', name: 'Core Payroll', amount: -14000, isSubItem: true },
      { id: 'pnl_11', name: 'Software Subscriptions', amount: -2105, isSubItem: true },
      { id: 'pnl_12', name: 'Marketing & Ads', amount: -1000, isSubItem: true },

      { id: 'pnl_13', name: 'Operating Profit', amount: 10450, isSubItem: false, isTotal: true },

      { id: 'pnl_14', name: 'Other Expenses', amount: -1430, isSubItem: false, isTotal: true },
      { id: 'pnl_15', name: 'Interest & Fees', amount: -1430, isSubItem: true },

      { id: 'pnl_16', name: 'Net Income', amount: 9020, isSubItem: false, isTotal: true },
    ],
    pnlTree: [
      {
        id: 'rev-total', name: 'Total Revenue', amount: 55000, variance: { percent: 4.2, direction: 'up' }, children: [
          { id: 'retainers', name: 'Client Retainers', amount: 45000, variance: { percent: 2.1, direction: 'up' }, drawerId: 'retainers', revenueWeight: 45000 / revenue },
          { id: 'projects', name: 'One-off Projects', amount: 10000, variance: { percent: 0, direction: 'flat' }, drawerId: 'projects', revenueWeight: 10000 / revenue },
        ],
      },
      {
        id: 'cogs-total', name: 'Direct Costs (COGS)', amount: -27445, variance: { percent: 14.8, direction: 'up' }, children: [
          { id: 'freelancer', name: 'Freelancer Fees', amount: -15500, variance: { percent: 0, direction: 'flat' }, drawerId: 'freelancer', revenueWeight: 15500 / revenue },
          { id: 'hosting', name: 'Hosting & Infrastructure', amount: -7245, variance: { percent: 15.0, direction: 'up' }, drawerId: 'hosting', revenueWeight: 7245 / revenue },
          { id: 'software', name: 'Software / Tools', amount: -4700, variance: { percent: 14.1, direction: 'up' }, drawerId: 'software', revenueWeight: 4700 / revenue },
        ],
      },
      { id: 'gp-total', name: 'Gross Profit', amount: 27555, variance: { percent: 1.2, direction: 'down' }, children: [], isHighlight: true, highlightColor: 'brand' },
      {
        id: 'opex-total', name: 'Operating Expenses (OpEx)', amount: -17105, variance: { percent: 5.1, direction: 'up' }, children: [
          { id: 'payroll', name: 'Core Payroll', amount: -14000, variance: { percent: 0, direction: 'flat' }, drawerId: 'payroll', revenueWeight: 14000 / revenue },
          { id: 'subs', name: 'Software Subscriptions', amount: -2105, variance: { percent: 3.9, direction: 'up' }, drawerId: 'subs', revenueWeight: 2105 / revenue },
          { id: 'marketing', name: 'Marketing & Ads', amount: -1000, variance: { percent: 23.9, direction: 'up' }, drawerId: 'marketing', revenueWeight: 1000 / revenue },
        ],
      },
      { id: 'op-total', name: 'Operating Profit', amount: 10450, variance: { percent: 2.1, direction: 'down' }, children: [] },
      {
        id: 'other-total', name: 'Other Expenses', amount: -1430, variance: { percent: 0, direction: 'flat' }, children: [
          { id: 'interest', name: 'Interest & Fees', amount: -1430, variance: { percent: 0, direction: 'flat' }, drawerId: 'interest', revenueWeight: 1430 / revenue },
        ],
      },
      { id: 'net-total', name: 'Net Income', amount: 9020, variance: { percent: 3.0, direction: 'down' }, children: [], isHighlight: true, highlightColor: 'emerald' },
    ],
    expenses: [
      { id: 'ev_1', category: 'OPEX', name: 'Marketing & Ads', amount: 1000, priorAmount: 807, variancePercent: 23.9, trend: 'up' },
      { id: 'ev_2', category: 'COGS', name: 'Hosting & Infrastructure', amount: 7245, priorAmount: 6300, variancePercent: 15.0, trend: 'up' },
      { id: 'ev_3', category: 'COGS', name: 'Software / Tools', amount: 4700, priorAmount: 4120, variancePercent: 14.1, trend: 'up' },
      { id: 'ev_4', category: 'OPEX', name: 'Software Subscriptions', amount: 2105, priorAmount: 2025, variancePercent: 3.9, trend: 'up' },
      { id: 'ev_5', category: 'COGS', name: 'Freelancer Fees', amount: 15500, priorAmount: 15500, variancePercent: 0, trend: 'flat' },
      { id: 'ev_6', category: 'OPEX', name: 'Core Payroll', amount: 14000, priorAmount: 14000, variancePercent: 0, trend: 'flat' },
    ],
    spendVectors: [
      {
        id: 'sv-payroll',
        name: 'Total Payroll',
        totalAmount: 29500,
        revenuePercent: 29500 / revenue,
        variance: { percent: 0, direction: 'flat' },
        components: [
          { label: 'Delivery', amount: 16800, drawerId: 'payroll-delivery' },
          { label: 'Marketing', amount: 4200, drawerId: 'payroll-marketing' },
          { label: 'Sales', amount: 5000, drawerId: 'payroll-sales' },
          { label: 'Admin', amount: 3500, drawerId: 'payroll-admin' },
        ],
      },
      {
        id: 'sv-software',
        name: 'Total Software',
        totalAmount: 6805,
        revenuePercent: 6805 / revenue,
        variance: { percent: 10.9, direction: 'up' },
        components: [
          { label: 'Delivery', amount: 3400, drawerId: 'software-delivery' },
          { label: 'Marketing', amount: 1605, drawerId: 'software-marketing' },
          { label: 'Sales', amount: 1050, drawerId: 'software-sales' },
          { label: 'Admin', amount: 750, drawerId: 'software-admin' },
        ],
      },
    ],
  });
}

export async function getARAgingSummary(): Promise<ARAgingSummary> {
  const open = invoices.filter((inv) => inv.status !== 'Paid');

  let current = 0;
  let days1to30 = 0;
  let days31to60 = 0;
  let days60plus = 0;

  for (const inv of open) {
    if (inv.daysOverdue === 0) current += inv.amount;
    else if (inv.daysOverdue <= 30) days1to30 += inv.amount;
    else if (inv.daysOverdue <= 60) days31to60 += inv.amount;
    else days60plus += inv.amount;
  }

  const buckets = [
    { label: 'Current', amount: current },
    { label: '1-30 Days', amount: days1to30 },
    { label: '31-60 Days', amount: days31to60 },
    { label: '60+ Days', amount: days60plus },
  ];

  return delay({
    buckets,
    totalOutstanding: current + days1to30 + days31to60 + days60plus,
  });
}

export async function getRecentScorecards(): Promise<ScorecardMonth[]> {
  return delay(recentScorecards);
}

export async function getClientsPageData(): Promise<ClientsPageData> {
  const [rawClients, allInvoices] = await Promise.all([
    getClients(),
    getInvoices(),
  ]);

  const activeClients = rawClients.filter(c => c.mrr > 0);
  const totalMrr = activeClients.reduce((sum, c) => sum + c.mrr, 0);
  const priorTotalMrr = Object.values(clientPriorMrr).reduce((sum, v) => sum + v, 0);

  let totalLostMrr = 0;
  const enriched: EnrichedClient[] = rawClients.map(client => {
    const priorMrr = clientPriorMrr[client.id] ?? client.mrr;
    const mrrChange = client.mrr - priorMrr;
    if (mrrChange < 0) totalLostMrr += Math.abs(mrrChange);

    const concentrationPct = computeConcentrationPct(client.mrr, totalMrr);
    const grossProfit = computeGrossProfit(client.mrr, client.margin);
    const clientInvoices = allInvoices.filter(inv => inv.clientId === client.id);
    const cohortYear = deriveCohortYear(client.tenure_months);

    let displayStatus: 'Active' | 'At Risk' | 'Churned';
    if (client.status === 'Churned') displayStatus = 'Churned';
    else if (client.status === 'At Risk') displayStatus = 'At Risk';
    else displayStatus = 'Active';

    const ue = clientUnitEconomics[client.id] ?? { directLaborCost: 0, softwareAdSpend: 0 };
    const netClientProfit = client.mrr - ue.directLaborCost - ue.softwareAdSpend;

    return {
      ...client,
      displayStatus,
      priorMrr,
      mrrChange,
      revenue90d: computeRevenue90d(client.mrr),
      grossProfit,
      marginLTV: computeMarginLTV(client.mrr, client.margin, client.tenure_months),
      runwayImpact: computeRunwayImpact(grossProfit, MONTHLY_OUTFLOW, CURRENT_RUNWAY, CASH_BALANCE),
      concentrationPct,
      cohortYear,
      riskTags: deriveRiskTagsWithMrrChange(client, clientInvoices, concentrationPct, mrrChange),
      shockTest: computeShockTest(client, rawClients, totalMrr, CURRENT_RUNWAY, MONTHLY_OUTFLOW, CASH_BALANCE),
      unitEconomics: {
        ...ue,
        netClientProfit,
        netMarginPct: client.mrr > 0 ? netClientProfit / client.mrr : 0,
      },
      marginTrend90d: clientMarginTrend90d[client.id] ?? [],
      profitRank: 0,
      totalInvoiced: clientInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      avgDaysToPay: clientAvgDaysToPay[client.id] ?? 0,
      clientMrrHistory: clientMrrHistoryPerClient[client.id] ?? [],
    };
  });

  const activeByProfit = enriched
    .filter(c => c.mrr > 0)
    .sort((a, b) => b.unitEconomics.netClientProfit - a.unitEconomics.netClientProfit);
  activeByProfit.forEach((c, i) => { c.profitRank = i + 1; });

  enriched.sort((a, b) => b.runwayImpact - a.runwayImpact);

  const topConcentration = enriched.length > 0 ? enriched.reduce((max, c) => Math.max(max, c.concentrationPct), 0) : 0;
  const topClientName = enriched.find(c => c.concentrationPct === topConcentration)?.name ?? '';

  const cohortRetainedMrr = computeCohortRetainedMrr(
    enriched.map(c => ({ mrr: c.mrr, cohortYear: c.cohortYear }))
  );

  const alert = topConcentration >= 25
    ? {
        title: 'Revenue concentration at ceiling',
        message: `${topClientName} represents ${topConcentration.toFixed(0)}% of total MRR — sitting on your 25% concentration ceiling. Any growth at their scale tips you into breach.`,
        type: 'warning' as const,
      }
    : null;

  const totalGrossProfit = activeClients.reduce((sum, c) => sum + c.mrr * c.margin, 0);
  const blendedGrossMargin = totalMrr > 0 ? totalGrossProfit / totalMrr : 0;

  const topProfitClient = enriched
    .filter(c => c.mrr > 0)
    .sort((a, b) => b.grossProfit - a.grossProfit)[0];
  const topClientProfitConcentration = topProfitClient && totalGrossProfit > 0
    ? (topProfitClient.grossProfit / totalGrossProfit) * 100
    : 0;

  const mrrTrendData = clientMrrHistory.map(h => ({ month: h.month, totalMrr: h.mrr }));
  const offsets = [-0.008, 0.003, 0.0];
  const marginTrendData = clientMrrHistory.map((h, i) => ({
    month: h.month,
    blendedMargin: Math.round((blendedGrossMargin + offsets[i % offsets.length]) * 1000) / 1000,
  }));

  return delay({
    clients: enriched,
    totalMrr,
    nrr: computeNRR(totalMrr, priorTotalMrr),
    grossMrrChurn: computeGrossChurn(totalLostMrr, priorTotalMrr),
    topClientConcentration: topConcentration,
    avgMarginLTV: computeAvgMarginLTV(activeClients),
    blendedGrossMargin,
    topClientProfitConcentration,
    mrrTrend: mrrTrendData,
    marginTrend: marginTrendData,
    mrrHistory: clientMrrHistory,
    cohortRetainedMrr,
    alert,
  });
}

export async function getClientProfileData(clientId: string): Promise<{ client: EnrichedClient; activeClientCount: number } | null> {
  const data = await getClientsPageData();
  const client = data.clients.find(c => c.id === clientId);
  if (!client) return null;
  const activeClientCount = data.clients.filter(c => c.mrr > 0).length;
  return { client, activeClientCount };
}

export async function getCalibrationData(): Promise<CalibrationData> {
  const unmappedTotal = coaAccounts
    .filter(a => a.group === null)
    .reduce((sum, a) => sum + a.floatingAmount, 0);

  return delay({
    integrations,
    coaAccounts,
    unmappedTotal,
    teamMembers,
    softwareItems,
    financialTargets,
  });
}

export async function getSettingsData(): Promise<SettingsData> {
  return delay(settingsData);
}

// ---------------------------------------------------------------------------
// Strategic CFO Scorecards
// ---------------------------------------------------------------------------

export async function getLivePulseData(): Promise<LivePulseData> {
  return delay(livePulseData);
}

export async function getSnapshotLedger(): Promise<SnapshotLedgerEntry[]> {
  return delay(snapshotLedger);
}

export async function getAntiPnlSnapshot(slug: string): Promise<AntiPnLSnapshot | null> {
  return delay(antiPnlSnapshots[slug] ?? null);
}
