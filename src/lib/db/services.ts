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
