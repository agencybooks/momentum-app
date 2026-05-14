import type { Integration, COAAccount, TeamMember, SoftwareItem, FinancialTarget } from './types'

export const integrations: Integration[] = [
  {
    id: 'int_qbo',
    name: 'QuickBooks Online',
    iconName: 'Database',
    status: 'connected',
    lastSync: 'Today, 8:14 AM',
    scoreWeight: 50,
  },
  {
    id: 'int_toggl',
    name: 'Toggl Track',
    iconName: 'Clock',
    status: 'connected',
    lastSync: 'Today, 7:30 AM',
    scoreWeight: 5,
  },
  {
    id: 'int_stripe',
    name: 'Stripe',
    iconName: 'CreditCard',
    status: 'delayed',
    lastSync: 'Yesterday, 11:42 PM',
    scoreWeight: 5,
  },
  {
    id: 'int_gusto',
    name: 'Gusto',
    iconName: 'Users',
    status: 'connected',
    lastSync: 'May 1, 2026',
    scoreWeight: 5,
  },
]

export const COA_GROUPS = ['Revenue', 'Direct Costs', 'Marketing/Sales', 'Admin'] as const
export const COA_SUB_CATEGORIES = ['SaaS', 'One-Time', 'Labor', 'Comp', 'Media', 'Tech'] as const

export const coaAccounts: COAAccount[] = [
  { id: 'coa_01', accountNumber: '4000', accountName: 'Subscription Rev', ytdTotal: 310000, group: 'Revenue', subCategory: 'SaaS', floatingAmount: 0 },
  { id: 'coa_02', accountNumber: '4100', accountName: 'Services Rev', ytdTotal: 85000, group: 'Revenue', subCategory: 'One-Time', floatingAmount: 0 },
  { id: 'coa_03', accountNumber: '5000', accountName: 'Prod. Salaries', ytdTotal: 130000, group: 'Direct Costs', subCategory: 'Labor', floatingAmount: 0 },
  { id: 'coa_04', accountNumber: '5050', accountName: 'Contractors', ytdTotal: 50000, group: 'Direct Costs', subCategory: 'Labor', floatingAmount: 0 },
  { id: 'coa_05', accountNumber: '6000', accountName: 'Sales Comm.', ytdTotal: 20000, group: 'Marketing/Sales', subCategory: 'Comp', floatingAmount: 0 },
  { id: 'coa_06', accountNumber: '6050', accountName: 'Uncategorized Exp', ytdTotal: 6200, group: null, subCategory: null, floatingAmount: 6200 },
  { id: 'coa_07', accountNumber: '6100', accountName: 'Google Ads', ytdTotal: 42000, group: 'Marketing/Sales', subCategory: 'Media', floatingAmount: 0 },
  { id: 'coa_08', accountNumber: '7000', accountName: 'Owner Comp', ytdTotal: 60000, group: 'Admin', subCategory: 'Comp', floatingAmount: 0 },
  { id: 'coa_09', accountNumber: '7200', accountName: 'Software Tools', ytdTotal: 14500, group: 'Admin', subCategory: 'Tech', floatingAmount: 0 },
]

export const teamMembers: TeamMember[] = [
  {
    id: 'tm_01',
    name: 'Sarah Chen',
    monthlyCost: 8500,
    role: 'Senior Developer',
    allocations: [
      { department: 'Delivery', percent: 80 },
      { department: 'Admin', percent: 20 },
    ],
  },
  {
    id: 'tm_02',
    name: 'Marcus Johnson',
    monthlyCost: 7200,
    role: 'Designer',
    allocations: [
      { department: 'Delivery', percent: 100 },
    ],
  },
  {
    id: 'tm_03',
    name: 'Emily Rodriguez',
    monthlyCost: 9000,
    role: 'Account Director',
    allocations: [
      { department: 'Sales', percent: 50 },
      { department: 'Delivery', percent: 30 },
      { department: 'Admin', percent: 20 },
    ],
  },
  {
    id: 'tm_04',
    name: 'James Park',
    monthlyCost: 6800,
    role: 'Junior Developer',
    allocations: [
      { department: 'Delivery', percent: 100 },
    ],
  },
  {
    id: 'tm_05',
    name: 'Lisa Thompson',
    monthlyCost: 10500,
    role: 'Founder / CEO',
    allocations: [
      { department: 'Admin', percent: 40 },
      { department: 'Sales', percent: 30 },
      { department: 'Marketing', percent: 30 },
    ],
  },
]

export const softwareItems: SoftwareItem[] = [
  { id: 'sw_01', vendor: 'Figma', trailing30DayCost: 75, category: 'shared-delivery' },
  { id: 'sw_02', vendor: 'Slack', trailing30DayCost: 120, category: 'overhead' },
  { id: 'sw_03', vendor: 'AWS', trailing30DayCost: 2400, category: null },
  { id: 'sw_04', vendor: 'Google Workspace', trailing30DayCost: 90, category: 'overhead' },
  { id: 'sw_05', vendor: 'Linear', trailing30DayCost: 50, category: null },
  { id: 'sw_06', vendor: 'Notion', trailing30DayCost: 80, category: null },
]

export const financialTargets: FinancialTarget[] = [
  // Survival & Cash
  { id: 'ft_runway', metric: 'Cash Runway', group: 'cash', floor: 6.0, ceiling: null, unit: 'months', currentValue: 5.4 },
  { id: 'ft_dso', metric: 'Days to Get Paid (DSO)', group: 'cash', floor: null, ceiling: 45, unit: 'days', currentValue: 41 },
  { id: 'ft_concentration', metric: 'Top Client Concentration', group: 'cash', floor: null, ceiling: 25, unit: '%', currentValue: 33.0 },
  { id: 'ft_cash_balance', metric: 'Cash Balance', group: 'cash', floor: 200000, ceiling: null, unit: '$', currentValue: 125000 },
  { id: 'ft_burn', metric: 'Net Burn Rate', group: 'cash', floor: null, ceiling: -8000, unit: '$', currentValue: -15200 },

  // Profitability Margins
  { id: 'ft_gross_margin', metric: 'Gross Margin', group: 'profitability', floor: 50, ceiling: null, unit: '%', currentValue: 50.1 },
  { id: 'ft_op_margin', metric: 'Operating Margin', group: 'profitability', floor: 20, ceiling: null, unit: '%', currentValue: 19.0 },
  { id: 'ft_net_margin', metric: 'Net Profit Margin', group: 'profitability', floor: 20, ceiling: null, unit: '%', currentValue: 16.4 },
  { id: 'ft_rev_fte', metric: 'Revenue per Full-Time Equivalent', group: 'profitability', floor: 180000, ceiling: null, unit: '$', currentValue: 168500 },

  // Capital Efficiency
  { id: 'ft_ler', metric: 'Labor Efficiency Ratio (LER)', group: 'efficiency', floor: 2.0, ceiling: null, unit: 'x', currentValue: 2.10 },
  { id: 'ft_nrr', metric: 'Net Revenue Retention (NRR)', group: 'efficiency', floor: 100, ceiling: null, unit: '%', currentValue: 105.1 },

  // Growth & Retention
  { id: 'ft_mrr', metric: 'MRR', group: 'growth', floor: 40000, ceiling: null, unit: '$', currentValue: 40000 },
  { id: 'ft_churn', metric: 'Monthly Churn', group: 'growth', floor: null, ceiling: 5, unit: '%', currentValue: 0.9 },
  { id: 'ft_cac_payback', metric: 'Customer Acquisition Cost Payback', group: 'growth', floor: null, ceiling: 12, unit: 'months', currentValue: 8.5 },
  { id: 'ft_ltv_cac', metric: 'LTV to Customer Acquisition Cost Ratio', group: 'growth', floor: 3.0, ceiling: null, unit: 'x', currentValue: 6.5 },
]
