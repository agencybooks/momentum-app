"use client"

import { useState, useRef, useEffect } from "react"
import { useQueryState } from "nuqs"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import { MetricAnchor } from "@/components/metric-anchor"
import { PnlTable } from "@/components/pnl-table"
import { SpendVectorCard } from "@/components/spend-vector-card"
import { PremiumWaterfallChart } from "@/components/premium-waterfall-chart"
import { grossMarginSparkline, opMarginSparkline, netMarginSparkline, revPerFteSparkline } from "@/lib/mock-data"
import { PageHeader } from "@/components/page-header"
import type { ProfitabilityData } from "@/lib/db/types"

const formatValue = (id: string, v: number) => {
  if (id === "ma_rev_per_fte") {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(v)
  }
  return `${(v * 100).toFixed(1)}%`
}

const targetMap: Record<string, string> = {
  ma_gross_margin: "> 60%",
  ma_op_margin: "> 20%",
  ma_net_margin: "> 20%",
  ma_rev_per_fte: "> $180,000",
}

const metricDrawerMap: Record<string, string> = {
  ma_gross_margin: "gross-margin-trend",
  ma_op_margin: "op-margin-trend",
  ma_net_margin: "net-margin-trend",
  ma_rev_per_fte: "rev-per-fte-trend",
}

const metricSparklineMap: Record<string, { date: string; value: number }[]> = {
  ma_gross_margin: grossMarginSparkline,
  ma_op_margin: opMarginSparkline,
  ma_net_margin: netMarginSparkline,
  ma_rev_per_fte: revPerFteSparkline,
}

interface Props {
  data: ProfitabilityData
}

export function ProfitabilityContent({ data }: Props) {
  const [, setDrawer] = useQueryState("drawer")
  const [pnlTab, setPnlTab] = useState<string>("summary")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(["sv-payroll", "sv-software"]))
  const pnlCardRef = useRef<HTMLDivElement>(null)
  const prevPnlTab = useRef(pnlTab)

  useEffect(() => {
    if (prevPnlTab.current !== pnlTab) {
      const timer = setTimeout(() => {
        pnlCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 220)
      prevPnlTab.current = pnlTab
      return () => clearTimeout(timer)
    }
    prevPnlTab.current = pnlTab
  }, [pnlTab])

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
      {/* Executive Summary Zone */}
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Profitability"
          subtitle="Diagnose margin compression and operating inefficiencies."
          actions={
            <div onClick={() => setDrawer("hosting")} className="cursor-pointer">
              <CoPilotAlert
                title="Margin Compression Detected"
                message="Gross margin slipped 1.2pts this month due to a 15% spike in indirect hosting costs and a 14% increase in software/tools spend."
                type="warning"
                drawerTrigger="hosting"
              />
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.metrics.map((m) => (
            <MetricAnchor
              key={m.id}
              title={m.title}
              value={formatValue(m.id, m.value)}
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
      </div>

      {/* Deep Dive Zone */}
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

      {/* Zones 3+4: Spend Vectors (left) + P&L Statement (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {data.spendVectors.map((sv) => (
            <SpendVectorCard
              key={sv.id}
              {...sv}
              revenue={data.revenue}
              expanded={expandedCards.has(sv.id)}
              onToggle={() => toggleCard(sv.id)}
            />
          ))}
        </div>

        <Card ref={pnlCardRef} className="overflow-hidden scroll-mt-4">
          <Tabs value={pnlTab} onValueChange={setPnlTab}>
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
              <span className="text-sm font-semibold">Profit &amp; Loss Statement</span>
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>
            </div>
            <PnlTable categories={data.pnlTree} revenue={data.revenue} view={pnlTab as "summary" | "detailed"} />
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
