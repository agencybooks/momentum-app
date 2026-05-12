"use client"

import { useQueryState } from "nuqs"
import { MetricAnchor } from "@/components/metric-anchor"
import { UnitEconomicsChart } from "@/components/unit-economics-chart"
import { RevenueAtRiskLedger } from "@/components/revenue-at-risk-ledger"
import { LeverageMatrix } from "@/components/growth/leverage-matrix"
import { PageHeader } from "@/components/page-header"
import { nrrSparkline, blendedCacSparkline, cacPaybackSparkline, ltvCacSparkline } from "@/lib/mock-data"

export function GrowthPageContent() {
  const [, setDrawer] = useQueryState('drawer')

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Growth & Capital Allocation"
        subtitle="Model your unit economics and scale your revenue pipeline."
      />

      {/* Zone 1: Unit Economics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricAnchor
          title="NET REVENUE RETENTION"
          value="112%"
          trendText="+2pp vs prior"
          trendUp={true}
          trendDirection="up-is-good"
          isHealthy={true}
          sparklineData={nrrSparkline}
          sentiment="positive"
          onClick={() => setDrawer('nrr-trend')}
        />
        <MetricAnchor
          title="BLENDED CAC"
          value="$13,200"
          trendText="-$1.1K vs prior"
          trendUp={false}
          trendDirection="down-is-good"
          isHealthy={true}
          sparklineData={blendedCacSparkline}
          sentiment="positive"
          onClick={() => setDrawer('blended-cac-trend')}
        />
        <MetricAnchor
          title="CAC PAYBACK PERIOD"
          value="8.5 mo"
          trendText="-0.3 mo vs prior"
          target="< 12 mo"
          trendUp={false}
          trendDirection="down-is-good"
          isHealthy={true}
          sparklineData={cacPaybackSparkline}
          sentiment="positive"
          onClick={() => setDrawer('cac-payback-trend')}
        />
        <MetricAnchor
          title="LTV:CAC RATIO"
          value="6.5x"
          trendText="+0.3x vs prior"
          target="> 3.0x"
          trendUp={true}
          trendDirection="up-is-good"
          isHealthy={true}
          sparklineData={ltvCacSparkline}
          sentiment="positive"
          onClick={() => setDrawer('ltv-cac-trend')}
        />
      </div>

      {/* Zone 2: MRR Movement — Full Width */}
      <UnitEconomicsChart />

      {/* Zone 3: Action Zone — Leverage + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <LeverageMatrix />
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <RevenueAtRiskLedger />
        </div>
      </div>
    </div>
  )
}
