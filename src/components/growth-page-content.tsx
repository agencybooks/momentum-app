"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MetricAnchor } from "@/components/metric-anchor"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Save } from "lucide-react"
import { UnitEconomicsChart } from "@/components/unit-economics-chart"
import { PipelineLedger } from "@/components/pipeline-ledger"

export function GrowthPageContent() {
  const [, setDrawer] = useQueryState('drawer')

  const [acquire, setAcquire] = useState([2.0])
  const [expand, setExpand] = useState([5.0])
  const [dealSize, setDealSize] = useState([10.0])
  const [retain, setRetain] = useState([1.0])

  const acquireLift = acquire[0] * 5000
  const expandLift = expand[0] * 600
  const dealSizeLift = dealSize[0] * 260
  const retainLift = retain[0] * 300

  const totalLift = acquireLift + expandLift + dealSizeLift + retainLift
  const targetArr = 310000 + (totalLift * 12)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Growth & Capital Allocation</h1>
        <p className="text-muted-foreground mt-1">Model your unit economics and scale your revenue pipeline.</p>
      </div>

      {/* Zone 1: Unit Economics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricAnchor
          title="LIFETIME VALUE (LTV)"
          value="$85,700"
          trendText="+$2.1K vs prior"
          trendUp={true}
          trendDirection="up-is-good"
          isHealthy={true}
        />
        <MetricAnchor
          title="BLENDED CAC"
          value="$13,200"
          trendText="-$1.1K vs prior"
          trendUp={false}
          trendDirection="down-is-good"
          isHealthy={true}
        />
        <MetricAnchor
          title="LTV:CAC RATIO"
          value="6.5x"
          trendText="+0.3x vs prior"
          target="> 3.0x"
          trendUp={true}
          trendDirection="up-is-good"
          isHealthy={true}
        />
        <Card className="flex flex-col justify-between transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">
              SPEND CEILING
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-semibold tracking-tight tabular-nums text-card-foreground">
              $28,600
            </div>
            <div
              className="mt-2 flex items-center text-xs font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setDrawer('m7')}
            >
              View Math <ArrowUpRight className="ml-1 h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone 2: Asymmetrical Grid — Narrative + Hit List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trend Chart + Leverage Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <UnitEconomicsChart />

          {/* Leverage Matrix */}
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              THE LEVERAGE MATRIX
            </div>
            <div className="flex items-center gap-4 text-sm font-medium mb-8">
              <span>Current Plateau: $310K ARR</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-primary font-bold">TARGET PLATEAU: ${(targetArr/1000).toFixed(0)}K ARR</span>
            </div>

            <div className="flex flex-col">
              {/* Lever 1: Acquire */}
              <div className="flex items-center gap-4 py-4 border-b border-border">
                <div className="w-1/6 text-sm font-medium">1. ACQUIRE</div>
                <div className="w-1/4 text-sm text-muted-foreground">Target: {acquire[0].toFixed(1)} logos/mo</div>
                <div className="w-1/3">
                  <Slider value={acquire} onValueChange={(val) => setAcquire(Array.isArray(val) ? [...val] : [val])} max={10} step={0.5} />
                </div>
                <div className="w-1/6 text-right text-sm text-success font-medium tabular-nums">+${(acquireLift/1000).toFixed(1)}K/mo</div>
                <div className="w-1/12 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDrawer('u5')}><ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Lever 2: Expand */}
              <div className="flex items-center gap-4 py-4 border-b border-border">
                <div className="w-1/6 text-sm font-medium">2. EXPAND</div>
                <div className="w-1/4 text-sm text-muted-foreground">Lift book by {expand[0]}%</div>
                <div className="w-1/3">
                  <Slider value={expand} onValueChange={(val) => setExpand(Array.isArray(val) ? [...val] : [val])} max={20} step={1} />
                </div>
                <div className="w-1/6 text-right text-sm text-success font-medium tabular-nums">+${(expandLift/1000).toFixed(1)}K/mo</div>
                <div className="w-1/12 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDrawer('u6')}><ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Lever 3: Deal Size */}
              <div className="flex items-center gap-4 py-4 border-b border-border">
                <div className="w-1/6 text-sm font-medium">3. DEAL SIZE</div>
                <div className="w-1/4 text-sm text-muted-foreground">Target: +{dealSize[0]}% avg</div>
                <div className="w-1/3">
                  <Slider value={dealSize} onValueChange={(val) => setDealSize(Array.isArray(val) ? [...val] : [val])} max={50} step={1} />
                </div>
                <div className="w-1/6 text-right text-sm text-success font-medium tabular-nums">+${(dealSizeLift/1000).toFixed(1)}K/mo</div>
                <div className="w-1/12 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDrawer('u7')}><ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Lever 4: Retain */}
              <div className="flex items-center gap-4 py-4">
                <div className="w-1/6 text-sm font-medium">4. RETAIN</div>
                <div className="w-1/4 text-sm text-muted-foreground">Target: -{retain[0].toFixed(1)}pt churn</div>
                <div className="w-1/3">
                  <Slider value={retain} onValueChange={(val) => setRetain(Array.isArray(val) ? [...val] : [val])} max={5} step={0.5} />
                </div>
                <div className="w-1/6 text-right text-sm text-success font-medium tabular-nums">+${(retainLift/1000).toFixed(1)}K/mo</div>
                <div className="w-1/12 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDrawer('u8')}><ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Pipeline Hit List + Commit Scenario */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <PipelineLedger />

          {/* Commit Scenario */}
          <Card className="p-6 bg-muted/30">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              COMMIT SCENARIO
            </div>
            <div className="text-3xl font-semibold tracking-tight text-success tabular-nums mt-2">+${totalLift.toLocaleString()} / mo</div>
            <p className="text-sm text-muted-foreground mt-1">Projected MRR Lift from active levers</p>
            <Button className="mt-6 w-full" onClick={() => setDrawer('u9')}>
              <Save className="mr-2 h-4 w-4" /> Save to Scenarios
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
