export const PERIOD_OPTIONS = ["3M", "6M", "12M", "YTD", "ALL"] as const
export type Period = (typeof PERIOD_OPTIONS)[number]
export const DEFAULT_PERIOD: Period = "6M"

// Months belonging to the prior calendar year in our Dec–May dataset
const PRIOR_YEAR_MONTHS = new Set(["Oct", "Nov", "Dec"])

export function filterByPeriod<T extends { month: string }>(data: T[], period: string): T[] {
  switch (period) {
    case "3M":
      return data.slice(-3)
    case "YTD":
      return data.filter((d) => !PRIOR_YEAR_MONTHS.has(d.month))
    case "6M":
    case "12M":
    case "ALL":
    default:
      return data
  }
}

const PERIOD_LABELS: Record<string, string> = {
  "3M": "Trailing 3 Months",
  "6M": "Trailing 6 Months",
  "12M": "Trailing 12 Months",
  "YTD": "Year to Date",
  "ALL": "All Time",
}

export function periodLabel(period: string): string {
  return PERIOD_LABELS[period] ?? "Trailing 6 Months"
}

export type YAxisFormat = "currency" | "percent" | "months" | "multiplier" | "days"

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function formatMetricValue(value: number, format: YAxisFormat): string {
  switch (format) {
    case "percent":
      return `${(value * 100).toFixed(1)}%`
    case "currency":
      return currencyFmt.format(value)
    case "months":
      return `${value.toFixed(1)} mo`
    case "multiplier":
      return `${value.toFixed(1)}x`
    case "days":
      return `${value.toFixed(0)} d`
  }
}

export function computePeriodAverage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  dataKey: string,
  format: YAxisFormat
): string {
  const values = data
    .map((d) => d[dataKey])
    .filter((v): v is number => typeof v === "number" && !Number.isNaN(v))
  if (values.length === 0) return "—"
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  return formatMetricValue(avg, format)
}
