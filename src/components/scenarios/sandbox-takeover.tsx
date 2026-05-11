"use client"

import { useState } from "react"
import { ArrowLeft, Save, Plus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const sandboxChartConfig = {
  baseline: { label: "Baseline ($k)", color: "var(--color-muted-foreground)" },
  scenario: { label: "Scenario ($k)", color: "var(--color-primary)" },
} satisfies ChartConfig

export default function SandboxTakeover({ onClose }: { onClose: () => void }) {
  const [var1, setVar1] = useState(true)
  const [var2, setVar2] = useState(true)
  const [var3, setVar3] = useState(false)
  const [showVar4, setShowVar4] = useState(false)
  const [var4, setVar4] = useState(true)

  const runway = 6.2 - (var1 ? 0.6 : 0) - (var2 ? 0.7 : 0) + (var3 ? 1.2 : 0) + ((showVar4 && var4) ? 0.8 : 0)
  const mrr = 45.2 + (var3 ? 15.0 : 0)
  const margin = 19.0 - (var1 ? 3.0 : 0) - (var2 ? 5.0 : 0) + (var3 ? 8.0 : 0) + ((showVar4 && var4) ? 3.0 : 0)

  const data = [
    { month: "Jun", baseline: 220, scenario: 220 },
    { month: "Jul", baseline: 200, scenario: var1 ? 180 : 200 },
    { month: "Aug", baseline: 180, scenario: var1 || var2 ? 140 : 180 },
    { month: "Sep", baseline: 160, scenario: (var1 || var2 ? 100 : 160) + ((showVar4 && var4) ? 20 : 0) },
    { month: "Oct", baseline: 140, scenario: (var1 || var2 ? 80 : 140) + ((showVar4 && var4) ? 20 : 0) },
    { month: "Nov", baseline: 120, scenario: (var1 || var2 ? 60 : 120) + ((showVar4 && var4) ? 20 : 0) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b px-6 bg-card shrink-0">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Exit Sandbox
        </Button>
        <div className="font-semibold tracking-tight">SCENARIO: HIRE 2-3 PEOPLE</div>
        <Button size="sm">
          <Save className="mr-2 h-4 w-4" /> Save Scenario
        </Button>
      </header>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: The Levers */}
        <div className="w-96 shrink-0 border-r p-6 overflow-y-auto bg-muted/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold tracking-tight">Variables</h3>
            <Button variant="outline" size="sm" onClick={() => setShowVar4(true)} disabled={showVar4}>
              <Plus className="h-4 w-4 mr-2" /> Add Variable
            </Button>
          </div>

          <Card
            className="p-4 mb-3 flex items-start space-x-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => setVar1(!var1)}
          >
            <Checkbox checked={var1} />
            <div className="space-y-1">
              <p className="font-medium text-sm leading-none">New Hire: Account Exec</p>
              <p className="text-sm text-destructive font-mono tabular-nums mt-1">-$85K/yr</p>
              <p className="text-xs text-muted-foreground mt-1">Starts: Jul</p>
            </div>
          </Card>

          <Card
            className="p-4 mb-3 flex items-start space-x-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => setVar2(!var2)}
          >
            <Checkbox checked={var2} />
            <div className="space-y-1">
              <p className="font-medium text-sm leading-none">New Hire: Engineer</p>
              <p className="text-sm text-destructive font-mono tabular-nums mt-1">-$120K/yr</p>
              <p className="text-xs text-muted-foreground mt-1">Starts: Aug</p>
            </div>
          </Card>

          <Card
            className="p-4 mb-3 flex items-start space-x-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => setVar3(!var3)}
          >
            <Checkbox checked={var3} />
            <div className="space-y-1">
              <p className="font-medium text-sm leading-none">Lift: Expected Rev</p>
              <span className="text-sm text-success font-mono tabular-nums mt-1 block">+$15K/mo</span>
              <p className="text-xs text-muted-foreground mt-1">Starts: Oct</p>
            </div>
          </Card>

          {showVar4 && (
            <Card
              className="p-4 mb-3 flex items-start space-x-3 cursor-pointer hover:border-primary border-success/50 bg-success/5 transition-colors"
              onClick={() => setVar4(!var4)}
            >
              <Checkbox checked={var4} />
              <div className="space-y-1">
                <p className="font-medium text-sm leading-none">Cut Software Tools</p>
                <p className="text-sm text-success font-mono tabular-nums mt-1">+$5K/mo</p>
                <p className="text-xs text-muted-foreground mt-1">Starts: Immediate</p>
              </div>
            </Card>
          )}
        </div>

        {/* Column 2: The Main Canvas */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Zone D: Co-Pilot Insight */}
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md flex items-start gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">Warning: Cash Crunch Approaching</strong>
              Hiring these roles drops your runway to {runway.toFixed(1)} months during their
              ramp period. You must activate the revenue lift variable to stay above your 5-month
              floor.
            </div>
          </div>

          {/* Zone B: Delta Anchors */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">RUNWAY IMPACT</div>
              <div
                className={cn(
                  "text-3xl font-semibold tabular-nums tracking-tight mt-2",
                  runway < 5.0 ? "text-destructive" : "text-success"
                )}
              >
                {runway.toFixed(1)} mo
              </div>
              <div className="text-xs text-muted-foreground mt-2">Baseline: 6.2 mo</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">MRR IMPACT</div>
              <div className="text-3xl font-semibold tabular-nums tracking-tight text-success mt-2">
                ${mrr.toFixed(1)}K /mo
              </div>
              <div className="text-xs text-muted-foreground mt-2">Baseline: $45.2K</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">NET MARGIN</div>
              <div
                className={cn(
                  "text-3xl font-semibold tabular-nums tracking-tight mt-2",
                  margin < 15.0 ? "text-destructive" : "text-success"
                )}
              >
                {margin.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">Baseline: 19.0%</div>
            </Card>
          </div>

          {/* Zone C: Projection Chart */}
          <Card className="p-6 h-[400px]">
            <h3 className="font-semibold mb-6">Cash Trajectory (Baseline vs Scenario)</h3>
            <ChartContainer config={sandboxChartConfig} className="w-full h-full min-h-[300px]">
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}k`} width={50} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="var(--color-muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Baseline ($k)"
                />
                <Line
                  type="monotone"
                  dataKey="scenario"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  name="Scenario ($k)"
                />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
