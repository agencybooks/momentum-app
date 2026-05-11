"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricAnchor } from "@/components/metric-anchor"
import { PnlTable } from "@/components/pnl-table"
import { SpendVectorCard } from "@/components/spend-vector-card"
import { PremiumWaterfallChart } from "@/components/premium-waterfall-chart"
import { grossMarginSparkline, opMarginSparkline, netMarginSparkline } from "@/lib/mock-data"
import type { ProfitabilityData } from "@/lib/db/types"

const formatPercent = (v: number) => `${(v * 100).toFixed(1)}%`

const targetMap: Record<string, string> = {
  ma_gross_margin: "> 60%",
  ma_op_margin: "> 20%",
  ma_net_margin: "> 20%",
}

const metricDrawerMap: Record<string, string> = {
  ma_gross_margin: "gross-margin-trend",
  ma_op_margin: "op-margin-trend",
  ma_net_margin: "net-margin-trend",
}

const metricSparklineMap: Record<string, { date: string; value: number }[]> = {
  ma_gross_margin: grossMarginSparkline,
  ma_op_margin: opMarginSparkline,
  ma_net_margin: netMarginSparkline,
}

interface Props {
  data: ProfitabilityData
}

export function ProfitabilityContent({ data }: Props) {
  const [, setDrawer] = useQueryState("drawer")
  const [spendExpanded, setSpendExpanded] = useState(false)

  const cogsCategory = data.pnlTree.find((c) => c.id === "cogs-total")!
  const opexCategory = data.pnlTree.find((c) => c.id === "opex-total")!
  const otherCategory = data.pnlTree.find((c) => c.id === "other-total")!

  const premiumWaterfallData = {
    revenue: data.revenue,
    cogs: Math.abs(cogsCategory.amount),
    grossProfit: data.pnlTree.find((c) => c.id === "gp-total")!.amount,
    expenses: Math.abs(opexCategory.amount) + Math.abs(otherCategory.amount),
    netProfit: data.pnlTree.find((c) => c.id === "net-total")!.amount,
  }

  const waterfallDetails = {
    cogs: cogsCategory.children.map((c) => ({ label: c.name, amount: Math.abs(c.amount) })),
    expenses: [...opexCategory.children, ...otherCategory.children]
      .map((c) => ({ label: c.name, amount: Math.abs(c.amount) })),
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Row 1: Header + Alert + KPIs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profitability</h1>
          <p className="text-muted-foreground mt-1">
            Diagnose margin compression and operating inefficiencies.
          </p>
        </div>
        <Button variant="outline" size="sm">May 2026</Button>
      </div>

      <div onClick={() => setDrawer("hosting")} className="cursor-pointer">
        <CoPilotAlert
          title="Margin Compression Detected"
          message="Gross margin slipped 1.2pts this month due to a 15% spike in indirect hosting costs and a 14% increase in software/tools spend."
          type="warning"
          drawerTrigger="hosting"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.metrics.map((m) => (
          <MetricAnchor
            key={m.id}
            title={m.title}
            value={formatPercent(m.value)}
            target={targetMap[m.id]}
            trendText={m.trendText}
            trendUp={m.trendUp}
            trendDirection={m.trendDirection}
            isHealthy={m.isHealthy}
            sparklineData={metricSparklineMap[m.id]}
            sentiment={m.isHealthy ? "positive" : "negative"}
            onClick={() => setDrawer(metricDrawerMap[m.id])}
          />
        ))}
      </div>

      {/* Row 2: Waterfall */}
      <Card className="overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-sm font-semibold">Profit Waterfall</h3>
        </div>
        <div className="px-6 pb-6">
          <PremiumWaterfallChart
            data={premiumWaterfallData}
            details={waterfallDetails}
          />
        </div>
      </Card>

      {/* Row 3: Spend Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.spendVectors.map((sv) => (
          <SpendVectorCard key={sv.id} {...sv} expanded={spendExpanded} onToggle={() => setSpendExpanded(!spendExpanded)} />
        ))}
      </div>

      {/* Row 4: Tabbed P&L Ledger */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="summary">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
            <span className="text-sm font-semibold">Profit &amp; Loss Statement</span>
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="summary">
            <PnlTable categories={data.pnlTree} revenue={data.revenue} view="summary" />
          </TabsContent>
          <TabsContent value="detailed">
            <PnlTable categories={data.pnlTree} revenue={data.revenue} view="detailed" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
