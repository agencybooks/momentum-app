"use client"

import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SCENARIO_CONSTANTS } from "@/lib/scenarios/constants"
import type { RevenueDrivers, SandboxAction } from "@/lib/scenarios/types"

interface RevenueDriversCardProps {
  drivers: RevenueDrivers
  dispatch: React.Dispatch<SandboxAction>
}

export function RevenueDriversCard({ drivers, dispatch }: RevenueDriversCardProps) {
  const displayGrowth = +(drivers.mrrGrowthPct * 100).toFixed(2)
  const displayChurn = +(drivers.targetChurnPct * 100).toFixed(2)
  const impliedMonthlyGrowth = Math.round(SCENARIO_CONSTANTS.currentMrr * drivers.mrrGrowthPct)

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="font-semibold tracking-tight">Revenue Drivers</h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm text-muted-foreground">Monthly MRR Growth %</label>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                step="0.1"
                value={displayGrowth}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) dispatch({ type: 'SET_MRR_GROWTH', payload: val / 100 })
                }}
                className="w-20 text-right font-mono tabular-nums h-8"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          {drivers.mrrGrowthPct !== 0 && (
            <p className="text-xs text-muted-foreground">
              ≈ {impliedMonthlyGrowth >= 0 ? '+' : ''}${Math.abs(impliedMonthlyGrowth).toLocaleString()}/mo compounding at $
              {(SCENARIO_CONSTANTS.currentMrr / 1000).toFixed(0)}K MRR
            </p>
          )}
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm text-muted-foreground">Monthly Churn %</label>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={displayChurn}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val) && val >= 0) dispatch({ type: 'SET_CHURN', payload: val / 100 })
                }}
                className="w-20 text-right font-mono tabular-nums h-8"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Baseline: {(SCENARIO_CONSTANTS.monthlyChurnRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  )
}
