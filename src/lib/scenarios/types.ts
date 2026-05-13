export interface RevenueDrivers {
  mrrGrowthPct: number
  targetChurnPct: number
}

export interface HeadcountRow {
  id: string
  title: string
  monthlySalary: number
  startMonth: number
}

export interface OpExRow {
  id: string
  category: string
  monthlyDelta: number
  startMonth: number
}

export interface SandboxDrivers {
  revenue: RevenueDrivers
  headcount: HeadcountRow[]
  opex: OpExRow[]
}

export interface ProjectionPoint {
  month: string
  monthIndex: number
  baselineCash: number
  scenarioCash: number
  baselineMrr: number
  scenarioMrr: number
  baselineExpenses: number
  scenarioExpenses: number
  delta: number
  runway: number
}

export type SandboxAction =
  | { type: 'SET_MRR_GROWTH'; payload: number }
  | { type: 'SET_CHURN'; payload: number }
  | { type: 'ADD_HEADCOUNT' }
  | { type: 'REMOVE_HEADCOUNT'; payload: string }
  | { type: 'UPDATE_HEADCOUNT'; payload: { id: string; field: keyof HeadcountRow; value: string | number } }
  | { type: 'ADD_OPEX' }
  | { type: 'REMOVE_OPEX'; payload: string }
  | { type: 'UPDATE_OPEX'; payload: { id: string; field: keyof OpExRow; value: string | number } }
  | { type: 'REVERT_TO_BASELINE' }
