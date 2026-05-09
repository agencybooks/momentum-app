import React from "react"
import { Card } from "@/components/ui/card"
import { MetricAnchor } from "@/components/metric-anchor"

export default function ScorecardsPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Zone 1: Executive Narrative */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Executive Narrative</h2>
        <Card className="p-6 border-none shadow-sm ring-1 ring-border/50">
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <span className="text-success font-medium mr-2">🟢 On Track:</span> 
              April was highly efficient. Hit 8 of 13 targets, with Gross Margin and Ending Cash outperforming baseline projections.
            </p>
            <p>
              <span className="text-destructive font-medium mr-2">🔴 Warning:</span>
              Net Margin missed our 20% target, primarily driven by unoptimized server infrastructure costs.
            </p>
          </div>
        </Card>
      </section>

      {/* Zone 2: The Final Snapshot */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-4">The Final Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetricAnchor
            title="Revenue"
            value="$125,000"
            target="$120k"
            isHealthy={true}
            trendText="Target Beat"
          />
          <MetricAnchor
            title="Gross Margin"
            value="68.0%"
            target="65%"
            isHealthy={true}
            trendText="Target Beat"
          />
          <MetricAnchor
            title="Net Profit"
            value="16.4%"
            target="20%"
            isHealthy={false}
            trendText="Missed"
          />
          <MetricAnchor
            title="Ending Cash"
            value="$222,800"
            target="$200k"
            isHealthy={true}
            trendText="Target Beat"
          />
        </div>
      </section>

      {/* Zone 3: The Goals Matrix (Exception Reporting) */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-4">The Goals Matrix</h2>
        <Card className="flex flex-col border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
          
          {/* Section A: OFF TRACK */}
          <div className="bg-destructive/5 px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-destructive flex items-center gap-2 tracking-tight">
              🚨 OFF TRACK (Action Required)
            </h3>
          </div>
          <div className="flex flex-col px-6">
            <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
              <span className="font-medium text-sm">Net Margin</span>
              <div className="text-right">
                <span className="text-destructive font-bold tabular-nums tracking-tight text-lg mr-3">16.4%</span>
                <span className="text-muted-foreground text-sm tabular-nums">vs 20.0% Target</span>
              </div>
            </div>
          </div>

          {/* Section B: ON TRACK */}
          <div className="bg-success/5 px-6 py-4 border-y border-border mt-0">
            <h3 className="font-semibold text-success flex items-center gap-2 tracking-tight">
              🟢 ON TRACK (Healthy)
            </h3>
          </div>
          <div className="flex flex-col px-6">
            <div className="flex items-center justify-between py-4 border-b border-border">
              <span className="font-medium text-sm">Revenue</span>
              <div className="text-right">
                <span className="text-success font-bold tabular-nums tracking-tight text-lg mr-3">$125,000</span>
                <span className="text-muted-foreground text-sm tabular-nums">vs $120,000 Target</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border">
              <span className="font-medium text-sm">Gross Margin</span>
              <div className="text-right">
                <span className="text-success font-bold tabular-nums tracking-tight text-lg mr-3">68.0%</span>
                <span className="text-muted-foreground text-sm tabular-nums">vs 65.0% Target</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
              <span className="font-medium text-sm">Ending Cash</span>
              <div className="text-right">
                <span className="text-success font-bold tabular-nums tracking-tight text-lg mr-3">$222,800</span>
                <span className="text-muted-foreground text-sm tabular-nums">vs $200,000 Target</span>
              </div>
            </div>
          </div>

        </Card>
      </section>

    </div>
  )
}
