export function formatCurrency(val: number): string {
  if (val === 0) return "$0"
  const abs = Math.abs(val)
  const sign = val < 0 ? "-" : ""
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`
  return `${sign}$${abs.toLocaleString()}`
}

export function formatCurrencyFull(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val)
}
