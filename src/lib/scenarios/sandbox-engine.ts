import { SCENARIO_CONSTANTS } from './constants'
import type { SandboxDrivers, ProjectionPoint } from './types'

export function computeSandboxProjection(drivers: SandboxDrivers): ProjectionPoint[] {
  const {
    currentMrr,
    cashBalance,
    monthlyChurnRate,
    historicalGrossMargin,
    trailing90DayOverhead,
    projectionMonths,
  } = SCENARIO_CONSTANTS

  const points: ProjectionPoint[] = []
  let runningBaselineCash = cashBalance
  let runningScenarioCash = cashBalance

  for (let m = 0; m < projectionMonths; m++) {
    const monthNum = m + 1

    // Baseline: CRR decay with fixed overhead
    const baselineMrr = currentMrr * Math.pow(1 - monthlyChurnRate, m)
    const baselineCOGS = baselineMrr * (1 - historicalGrossMargin)
    const baselineExpenses = baselineCOGS + trailing90DayOverhead
    const baselineNet = baselineMrr - baselineExpenses
    runningBaselineCash += baselineNet

    // Scenario: compound growth adjusted by target churn
    const scenarioMrr =
      currentMrr *
      Math.pow(1 + drivers.revenue.mrrGrowthPct, m) *
      Math.pow(1 - drivers.revenue.targetChurnPct, m)

    const scenarioCOGS = scenarioMrr * (1 - historicalGrossMargin)

    const headcountCost = drivers.headcount
      .filter((h) => monthNum >= h.startMonth)
      .reduce((sum, h) => sum + h.monthlySalary, 0)

    const opexDelta = drivers.opex
      .filter((o) => monthNum >= o.startMonth)
      .reduce((sum, o) => sum + o.monthlyDelta, 0)

    const scenarioExpenses = scenarioCOGS + trailing90DayOverhead + headcountCost + opexDelta
    const scenarioNet = scenarioMrr - scenarioExpenses
    runningScenarioCash += scenarioNet

    const runway =
      scenarioNet >= 0
        ? 99
        : Math.max(0, runningScenarioCash / Math.abs(scenarioNet))

    const date = new Date()
    date.setMonth(date.getMonth() + monthNum)
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

    points.push({
      month: monthLabel,
      monthIndex: m,
      baselineCash: Math.round(runningBaselineCash),
      scenarioCash: Math.round(runningScenarioCash),
      baselineMrr: Math.round(baselineMrr),
      scenarioMrr: Math.round(scenarioMrr),
      baselineExpenses: Math.round(baselineExpenses),
      scenarioExpenses: Math.round(scenarioExpenses),
      delta: Math.round(runningScenarioCash - runningBaselineCash),
      runway: Math.round(runway * 10) / 10,
    })
  }

  return points
}
