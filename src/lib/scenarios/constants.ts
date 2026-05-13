export const SCENARIO_CONSTANTS = {
  currentMrr: 40_000,
  cashBalance: 125_000,
  currentRunway: 5.4,
  monthlyChurnRate: 0.009,
  historicalGrossMargin: 0.501,
  trailing90DayOverhead: 17_105,
  projectionMonths: 12,
  runwayFloor: 5.0,
} as const

export function formatScenarioCurrency(val: number): string {
  const abs = Math.abs(val)
  const sign = val >= 0 ? '+' : '-'
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  return `${sign}$${abs}`
}
