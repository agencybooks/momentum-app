"use client"

import { useState, useCallback } from "react"
import { useQueryState, parseAsString } from "nuqs"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ConfidenceScore } from "@/components/calibration/confidence-score"
import { DataSyncTab } from "@/components/calibration/data-sync-tab"
import { COAMappingTab } from "@/components/calibration/coa-mapping-tab"
import { MarginAllocationTab } from "@/components/calibration/margin-allocation-tab"
import { FinancialTargetsTab } from "@/components/calibration/financial-targets-tab"
import type { CalibrationData } from "@/lib/db/types"

const TAB_VALUES = ["data-sync", "coa-mapping", "margin-allocation", "financial-targets"] as const

function computeInitialIntegrationScore(data: CalibrationData): number {
  return data.integrations
    .filter(i => i.status !== 'disconnected')
    .reduce((sum, i) => sum + i.scoreWeight, 0)
}

function computeInitialCoaScore(data: CalibrationData): number {
  const total = data.coaAccounts.length
  const mapped = data.coaAccounts.filter(a => a.group !== null).length
  return total > 0 ? (mapped / total) * 15 : 15
}

function computeInitialAllocationScore(data: CalibrationData): number {
  const swTotal = data.softwareItems.length
  const swDone = data.softwareItems.filter(s => s.category !== null).length
  const swScore = swTotal > 0 ? (swDone / swTotal) * 5 : 5

  const tmTotal = data.teamMembers.length
  const tmDone = data.teamMembers.filter(t =>
    t.allocations.length > 0 &&
    t.allocations.reduce((s, a) => s + a.percent, 0) === 100
  ).length
  const tmScore = tmTotal > 0 ? (tmDone / tmTotal) * 5 : 5

  return swScore + tmScore
}

function computeInitialTargetScore(data: CalibrationData): number {
  const total = data.financialTargets.length
  const withValues = data.financialTargets.filter(t => t.floor !== null || t.ceiling !== null).length
  return total > 0 ? (withValues / total) * 10 : 10
}

export function CalibrationContent({ data }: { data: CalibrationData }) {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("data-sync"))

  const [integrationScore, setIntegrationScore] = useState(() => computeInitialIntegrationScore(data))
  const [coaScore, setCoaScore] = useState(() => computeInitialCoaScore(data))
  const [allocationScore, setAllocationScore] = useState(() => computeInitialAllocationScore(data))
  const [targetScore, setTargetScore] = useState(() => computeInitialTargetScore(data))

  const totalScore = integrationScore + coaScore + allocationScore + targetScore

  const handleIntegrationScoreChange = useCallback((score: number) => setIntegrationScore(score), [])
  const handleCoaScoreChange = useCallback((score: number) => setCoaScore(score), [])
  const handleAllocationScoreChange = useCallback((score: number) => setAllocationScore(score), [])
  const handleTargetScoreChange = useCallback((score: number) => setTargetScore(score), [])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Calibration"
        subtitle="Tune your financial engine, map your ledgers, and set your targets."
        actions={<ConfidenceScore score={totalScore} />}
      />

      <Tabs
        value={tab ?? "data-sync"}
        onValueChange={(val) => setTab(val as string)}
      >
        <TabsList variant="line" className="mb-6 border-b border-border/40 pb-0">
          <TabsTrigger value="data-sync">Data Sync</TabsTrigger>
          <TabsTrigger value="coa-mapping">COA Mapping</TabsTrigger>
          <TabsTrigger value="margin-allocation">Margin Allocation</TabsTrigger>
          <TabsTrigger value="financial-targets">Financial Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="data-sync">
          <DataSyncTab
            integrations={data.integrations}
            onScoreChange={handleIntegrationScoreChange}
          />
        </TabsContent>

        <TabsContent value="coa-mapping">
          <COAMappingTab
            accounts={data.coaAccounts}
            onScoreChange={handleCoaScoreChange}
          />
        </TabsContent>

        <TabsContent value="margin-allocation">
          <MarginAllocationTab
            teamMembers={data.teamMembers}
            softwareItems={data.softwareItems}
            onScoreChange={handleAllocationScoreChange}
          />
        </TabsContent>

        <TabsContent value="financial-targets">
          <FinancialTargetsTab
            targets={data.financialTargets}
            onScoreChange={handleTargetScoreChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
