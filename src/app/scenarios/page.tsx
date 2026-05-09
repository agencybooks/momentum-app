"use client"

import React, { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { MetricAnchor } from "@/components/metric-anchor"
import { FinancialChart } from "@/components/ui/custom/financial-chart"

export default function ScenariosPage() {
  const [newHires, setNewHires] = useState(0)
  const [serverSavings, setServerSavings] = useState(0)

  const { adjustedBurn, adjustedRunway, chartData } = useMemo(() => {
    const baseCash = 222800
    const baseBurn = 41200
    const burn = baseBurn + (newHires * 12000) - serverSavings
    const runway = burn > 0 ? baseCash / burn : 0

    const data = []
    let currentBalance = baseCash
    const today = new Date()
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
      data.push({
        date: date.toISOString(),
        cashBalance: currentBalance,
        netBurn: burn
      })
      currentBalance -= burn
    }

    return { adjustedBurn: burn, adjustedRunway: runway, chartData: data }
  }, [newHires, serverSavings])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Zone A: The Levers</h2>
        <Card className="p-6 flex flex-col gap-8 border-none shadow-sm ring-1 ring-border/50">
          <div>
            <h3 className="text-lg font-medium mb-4 tracking-tight">Headcount Planning</h3>
            <div className="space-y-4">
              <div className="text-sm font-medium tabular-nums">
                New Hires: {newHires}
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[newHires]}
                onValueChange={(val) => setNewHires(Array.isArray(val) ? val[0] : val)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Assumes $12k/mo fully loaded cost per hire</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 tracking-tight">Cost Reductions</h3>
            <div className="space-y-4">
              <div className="text-sm font-medium tabular-nums">
                Server Savings: ${serverSavings.toLocaleString()}
              </div>
              <Slider
                min={0}
                max={10000}
                step={1000}
                value={[serverSavings]}
                onValueChange={(val) => setServerSavings(Array.isArray(val) ? val[0] : val)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Immediate monthly infrastructure savings</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Zone B: The Real-Time Delta</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MetricAnchor
              title="Adjusted Net Burn"
              value={`$${adjustedBurn.toLocaleString()}`}
            isHealthy={adjustedBurn <= 41200}
            trendText={adjustedBurn < 41200 ? "Improved" : adjustedBurn > 41200 ? "Increased" : "Baseline"}
          />
          <MetricAnchor
            title="Projected Runway"
            value={`${adjustedRunway.toFixed(1)} mo`}
            isHealthy={adjustedRunway >= 20}
            trendText={adjustedRunway > 20 ? "Extended" : adjustedRunway < 20 ? "Shortened" : "Baseline"}
          />
        </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <h2 className="text-xl font-semibold tracking-tight">Zone C: The Visual Projection</h2>
          <Card className="flex-1 min-h-[400px] flex p-6 items-center justify-center bg-card shadow-sm border ring-1 ring-border/50">
            <FinancialChart data={chartData} />
          </Card>
        </div>
      </div>
    </div>
  )
}
