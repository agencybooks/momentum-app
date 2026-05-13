import type { Client, Invoice } from '@/lib/db/types'

export const CASH_BALANCE = 125000
export const CURRENT_RUNWAY = 5.4
// Implied monthly outflow derived from cash balance / runway (not the raw net burn figure)
export const MONTHLY_OUTFLOW = CASH_BALANCE / CURRENT_RUNWAY

export function computeConcentrationPct(clientMrr: number, totalMrr: number): number {
  if (totalMrr === 0) return 0
  return (clientMrr / totalMrr) * 100
}

export function computeRevenue90d(mrr: number): number {
  return mrr * 3
}

export function computeGrossProfit(mrr: number, margin: number): number {
  return mrr * margin
}

export function computeMarginLTV(mrr: number, margin: number, tenureMonths: number): number {
  return mrr * margin * tenureMonths
}

export function computeAvgMarginLTV(clients: { mrr: number; margin: number; tenure_months: number }[]): number {
  const active = clients.filter(c => c.mrr > 0)
  if (active.length === 0) return 0
  const totalWeightedLTV = active.reduce((sum, c) => sum + computeMarginLTV(c.mrr, c.margin, c.tenure_months) * c.mrr, 0)
  const totalMrr = active.reduce((sum, c) => sum + c.mrr, 0)
  return totalWeightedLTV / totalMrr
}

export function computeRunwayImpact(
  clientGrossProfit: number,
  monthlyOutflow: number,
  currentRunway: number,
  cashBalance: number,
): number {
  if (monthlyOutflow === 0) return 0
  const newOutflow = monthlyOutflow + clientGrossProfit
  if (newOutflow <= 0) return 0
  const newRunway = cashBalance / newOutflow
  return Math.max(0, currentRunway - newRunway)
}

export function computeNRR(currentTotalMrr: number, priorTotalMrr: number): number {
  if (priorTotalMrr === 0) return 100
  return (currentTotalMrr / priorTotalMrr) * 100
}

export function computeGrossChurn(lostMrr: number, priorTotalMrr: number): number {
  if (priorTotalMrr === 0) return 0
  return (Math.abs(lostMrr) / priorTotalMrr) * 100
}

export function deriveRiskTags(
  client: Client,
  clientInvoices: Invoice[],
  concentrationPct: number,
): { label: string; variant: 'amber' | 'destructive' }[] {
  const tags: { label: string; variant: 'amber' | 'destructive' }[] = []

  if (client.status === 'At Risk') {
    tags.push({ label: 'At Risk', variant: 'destructive' })
  }

  const hasSlowPay = clientInvoices.some(inv => inv.status === 'Overdue' && inv.daysOverdue > 30)
  if (hasSlowPay) {
    tags.push({ label: 'Slow Pay', variant: 'destructive' })
  }

  if (concentrationPct >= 25) {
    tags.push({ label: 'Concentration', variant: 'amber' })
  }

  return tags
}

export function deriveRiskTagsWithMrrChange(
  client: Client,
  clientInvoices: Invoice[],
  concentrationPct: number,
  mrrChange: number,
): { label: string; variant: 'amber' | 'destructive' }[] {
  const tags = deriveRiskTags(client, clientInvoices, concentrationPct)

  if (mrrChange < 0) {
    tags.push({ label: 'Declining Rev', variant: 'amber' })
  }

  return tags
}

export function computeShockTest(
  client: Client,
  allClients: Client[],
  totalMrr: number,
  currentRunway: number,
  monthlyOutflow: number,
  cashBalance: number,
): {
  revenueImpact: string
  annualizedImpact: string
  runwayBefore: string
  runwayAfter: string
  runwayDelta: string
  newTopClient: string
  newTopClientPct: string
} {
  const monthlyImpact = client.mrr
  const annualized = monthlyImpact * 12
  const grossProfit = client.mrr * client.margin
  const newOutflow = monthlyOutflow + grossProfit
  const newRunway = newOutflow > 0 ? cashBalance / newOutflow : currentRunway
  const runwayDelta = currentRunway - newRunway

  const remaining = allClients
    .filter(c => c.id !== client.id && c.mrr > 0)
    .sort((a, b) => b.mrr - a.mrr)
  const newTop = remaining[0]
  const remainingTotal = totalMrr - client.mrr
  const newTopPct = newTop && remainingTotal > 0
    ? ((newTop.mrr / remainingTotal) * 100).toFixed(0)
    : '0'

  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1000) return `$${(abs / 1000).toFixed(1)}K`
    return `$${abs.toLocaleString()}`
  }

  return {
    revenueImpact: `-${fmt(monthlyImpact)}`,
    annualizedImpact: `-${fmt(annualized)} annualized`,
    runwayBefore: currentRunway.toFixed(1),
    runwayAfter: newRunway.toFixed(1),
    runwayDelta: `-${runwayDelta.toFixed(1)} mo runway`,
    newTopClient: newTop?.name ?? 'N/A',
    newTopClientPct: `Would hold ${newTopPct}% of revenue`,
  }
}

export function deriveCohortYear(tenureMonths: number, referenceYear: number = 2026): number {
  return referenceYear - Math.ceil(tenureMonths / 12)
}

export function computeCohortRetainedMrr(
  clients: { mrr: number; cohortYear: number }[],
): { year: number; retainedMrr: number; activeClientCount: number }[] {
  const active = clients.filter(c => c.mrr > 0)
  const groups = new Map<number, { mrr: number; count: number }>()

  for (const c of active) {
    const existing = groups.get(c.cohortYear) ?? { mrr: 0, count: 0 }
    existing.mrr += c.mrr
    existing.count += 1
    groups.set(c.cohortYear, existing)
  }

  return Array.from(groups.entries())
    .map(([year, g]) => ({
      year,
      retainedMrr: g.mrr,
      activeClientCount: g.count,
    }))
    .sort((a, b) => a.year - b.year)
}
