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
  trendText: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success';
  linkTo: string;
  drawerTrigger: string;
}
