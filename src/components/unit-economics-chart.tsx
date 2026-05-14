"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BridgeWaterfallChart } from "@/components/waterfall/bridge-waterfall-chart"
import { mrrMovementSteps } from "@/lib/mock-data"

export function UnitEconomicsChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">MRR Bridge</CardTitle>
        <CardDescription>Your cost to acquire a client pays back in X months.</CardDescription>
      </CardHeader>
      <CardContent>
        <BridgeWaterfallChart steps={mrrMovementSteps} />
      </CardContent>
    </Card>
  )
}
