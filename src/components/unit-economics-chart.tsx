"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BridgeWaterfallChart } from "@/components/waterfall/bridge-waterfall-chart"
import { mrrMovementSteps } from "@/lib/mock-data"

export function UnitEconomicsChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">MRR Movement</CardTitle>
      </CardHeader>
      <CardContent>
        <BridgeWaterfallChart steps={mrrMovementSteps} />
      </CardContent>
    </Card>
  )
}
