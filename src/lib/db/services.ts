import type { Client, Invoice, Transaction, MetricAnchor, Alert } from './types';
import { clients, invoices, transactions, metricAnchors, alerts } from './mock-db';

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
  // Return cash-specific metric anchors
  return delay([
    metricAnchors[2], // Cash Runway
    metricAnchors[3], // A/R Aging
    { id: 'ma_07', title: 'Operating Cash', value: 125000, target: 100000, isHealthy: true, trendText: '+15k vs prior' }
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
    metricAnchors[2], // Cash Runway
    { id: 'ma_burn', title: 'Net Burn', value: 12500, target: 10000, isHealthy: false, trendText: '+$2.5k vs prior month' },
    metricAnchors[0], // MRR
    { id: 'ma_margin', title: 'Gross Margin', value: 0.65, target: 0.60, isHealthy: true, trendText: '+5% vs prior month' }
  ]);
}

export async function getProfitabilityData(): Promise<import('./types').ProfitabilityData> {
  return delay({
    metrics: [
      { id: 'ma_margin', title: 'Gross Margin %', value: 0.65, target: 0.60, isHealthy: true, trendText: '+5% vs prior' },
      { id: 'ma_net_income', title: 'Net Income', value: 18500, target: 15000, isHealthy: true, trendText: '+$3.5k vs prior' },
      { id: 'ma_mrr_growth', title: 'MRR Growth', value: 0.08, target: 0.10, isHealthy: false, trendText: 'Missed target by 2%' }
    ],
    pnl: [
      { id: 'pnl_1', name: 'Total Revenue', amount: 55000, isSubItem: false, isTotal: true },
      { id: 'pnl_2', name: 'Client Retainers', amount: 45000, isSubItem: true },
      { id: 'pnl_3', name: 'One-off Projects', amount: 10000, isSubItem: true },
      
      { id: 'pnl_4', name: 'Cost of Goods Sold (COGS)', amount: -19250, isSubItem: false, isTotal: true },
      { id: 'pnl_5', name: 'Freelancer Fees', amount: -12000, isSubItem: true },
      { id: 'pnl_6', name: 'Hosting & Infrastructure', amount: -7250, isSubItem: true },
      
      { id: 'pnl_7', name: 'Gross Profit', amount: 35750, isSubItem: false, isTotal: true },
      
      { id: 'pnl_8', name: 'Operating Expenses (OpEx)', amount: -17250, isSubItem: false, isTotal: true },
      { id: 'pnl_9', name: 'Core Payroll', amount: -14000, isSubItem: true },
      { id: 'pnl_10', name: 'Software Subscriptions', amount: -2250, isSubItem: true },
      { id: 'pnl_11', name: 'Marketing & Ads', amount: -1000, isSubItem: true },
      
      { id: 'pnl_12', name: 'Net Income', amount: 18500, isSubItem: false, isTotal: true }
    ]
  });
}
