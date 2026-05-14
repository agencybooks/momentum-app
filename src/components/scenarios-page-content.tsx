"use client"

import { useReducer, useMemo } from "react"
import { RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import { SCENARIO_CONSTANTS, formatScenarioCurrency } from "@/lib/scenarios/constants"
import { computeSandboxProjection } from "@/lib/scenarios/sandbox-engine"
import type { SandboxDrivers, SandboxAction } from "@/lib/scenarios/types"
import { OracleChart } from "@/components/scenarios/oracle-chart"
import { RevenueDriversCard } from "@/components/scenarios/revenue-drivers-card"
import { HeadcountPlannerCard } from "@/components/scenarios/headcount-planner-card"
import { OpExAdjustmentsCard } from "@/components/scenarios/opex-adjustments-card"

function createBaselineDrivers(): SandboxDrivers {
  return {
    revenue: {
      mrrGrowthPct: 0,
      targetChurnPct: SCENARIO_CONSTANTS.monthlyChurnRate,
    },
    headcount: [],
    opex: [],
  }
}

function sandboxReducer(state: SandboxDrivers, action: SandboxAction): SandboxDrivers {
  switch (action.type) {
    case 'SET_MRR_GROWTH':
      return { ...state, revenue: { ...state.revenue, mrrGrowthPct: action.payload } }
    case 'SET_CHURN':
      return { ...state, revenue: { ...state.revenue, targetChurnPct: action.payload } }
    case 'ADD_HEADCOUNT':
      return {
        ...state,
        headcount: [
          ...state.headcount,
          { id: crypto.randomUUID(), title: '', monthlySalary: 0, startMonth: 1 },
        ],
      }
    case 'REMOVE_HEADCOUNT':
      return { ...state, headcount: state.headcount.filter((h) => h.id !== action.payload) }
    case 'UPDATE_HEADCOUNT':
      return {
        ...state,
        headcount: state.headcount.map((h) =>
          h.id === action.payload.id ? { ...h, [action.payload.field]: action.payload.value } : h
        ),
      }
    case 'ADD_OPEX':
      return {
        ...state,
        opex: [
          ...state.opex,
          { id: crypto.randomUUID(), category: '', monthlyDelta: 0, startMonth: 1 },
        ],
      }
    case 'REMOVE_OPEX':
      return { ...state, opex: state.opex.filter((o) => o.id !== action.payload) }
    case 'UPDATE_OPEX':
      return {
        ...state,
        opex: state.opex.map((o) =>
          o.id === action.payload.id ? { ...o, [action.payload.field]: action.payload.value } : o
        ),
      }
    case 'REVERT_TO_BASELINE':
      return createBaselineDrivers()
  }
}

export function ScenariosPageContent() {
  const [drivers, dispatch] = useReducer(sandboxReducer, null, createBaselineDrivers)

  const projectionData = useMemo(
    () => computeSandboxProjection(drivers),
    [drivers]
  )

  const lastPoint = projectionData[projectionData.length - 1]
  const mrrDelta = (lastPoint?.scenarioMrr ?? 0) - (lastPoint?.baselineMrr ?? 0)
  const cashDelta = lastPoint?.delta ?? 0
  const finalRunway = lastPoint?.runway ?? SCENARIO_CONSTANTS.currentRunway
  const minRunway = Math.min(...projectionData.map((p) => p.runway))
  const showWarning = minRunway < SCENARIO_CONSTANTS.runwayFloor

  const isDivergent =
    drivers.revenue.mrrGrowthPct !== 0 ||
    drivers.revenue.targetChurnPct !== SCENARIO_CONSTANTS.monthlyChurnRate ||
    drivers.headcount.length > 0 ||
    drivers.opex.length > 0

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Sandbox"
        subtitle="Adjust the drivers below and watch the projection update in real time."
        actions={
          isDivergent ? (
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'REVERT_TO_BASELINE' })}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Revert to Baseline
            </Button>
          ) : undefined
        }
      />

      {showWarning && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-1">Warning: Runway Below Safety Floor</strong>
            This scenario drops your runway to{" "}
            <span className="font-mono tabular-nums font-semibold">
              {minRunway.toFixed(1)} months
            </span>{" "}
            during the projection period, breaching your{" "}
            {SCENARIO_CONSTANTS.runwayFloor}-month floor.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm font-medium text-muted-foreground">RUNWAY IMPACT</div>
          <div
            className={cn(
              "text-3xl font-semibold tabular-nums tracking-tight mt-2",
              finalRunway < SCENARIO_CONSTANTS.runwayFloor ? "text-destructive" : "text-success"
            )}
          >
            {finalRunway >= 99 ? "99+" : finalRunway.toFixed(1)} mo
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Baseline: {SCENARIO_CONSTANTS.currentRunway.toFixed(1)} mo
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-muted-foreground">MRR IMPACT</div>
          <div
            className={cn(
              "text-3xl font-semibold tabular-nums tracking-tight mt-2",
              mrrDelta >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {formatScenarioCurrency(mrrDelta)}/mo
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Scenario: ${((lastPoint?.scenarioMrr ?? 0) / 1000).toFixed(1)}K · Baseline: $
            {((lastPoint?.baselineMrr ?? 0) / 1000).toFixed(1)}K
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-muted-foreground">CASH IMPACT</div>
          <div
            className={cn(
              "text-3xl font-semibold tabular-nums tracking-tight mt-2",
              cashDelta >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {formatScenarioCurrency(cashDelta)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            End-of-period delta vs baseline
          </div>
        </Card>
      </div>

      <OracleChart data={projectionData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueDriversCard drivers={drivers.revenue} dispatch={dispatch} />
        <HeadcountPlannerCard headcount={drivers.headcount} dispatch={dispatch} />
        <OpExAdjustmentsCard opex={drivers.opex} dispatch={dispatch} />
      </div>
    </div>
  )
}
