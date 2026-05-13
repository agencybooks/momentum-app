export type MetricUnit = "$" | "%" | "ratio" | "days"

export interface TrendMetric {
  id: string
  label: string
  unit: MetricUnit
  group: "revenue" | "profitability" | "liquidity"
  dataKey: keyof TrendsTimelinePoint
  renderAs: "bar" | "line"
}

export interface TrendsTimelinePoint {
  month: string
  mrr: number
  netMomentum: number
  nrr: number
  grossMargin: number
  netMargin: number
  laborEfficiency: number
  cashPosition: number
  dso: number
}
