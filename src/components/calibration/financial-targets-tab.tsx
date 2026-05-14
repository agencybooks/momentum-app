"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { FinancialTarget } from "@/lib/db/types"

interface FinancialTargetsTabProps {
  targets: FinancialTarget[]
  onScoreChange: (score: number) => void
}

const SECTIONS = [
  { group: "cash" as const, label: "SURVIVAL & CASH GOALS", Icon: Shield },
  { group: "profitability" as const, label: "PROFITABILITY MARGINS", Icon: Target },
  { group: "efficiency" as const, label: "CAPITAL EFFICIENCY", Icon: Target },
  { group: "growth" as const, label: "GROWTH & RETENTION", Icon: Target },
] as const

function getUnitSuffix(unit: FinancialTarget["unit"]): string {
  switch (unit) {
    case "%": return "%"
    case "$": return "$"
    case "months": return "mo"
    case "days": return "days"
    case "x": return "x"
  }
}

function formatCurrentValue(value: number, unit: FinancialTarget["unit"]): string {
  switch (unit) {
    case "$": return formatCurrency(value)
    case "%": return `${value}%`
    case "months": return `${value} mo`
    case "days": return `${value} days`
    case "x": return `${value}x`
  }
}

function isHealthy(target: FinancialTarget): boolean {
  if (target.id === "ft_burn") {
    return target.ceiling !== null && target.currentValue >= target.ceiling
  }
  if (target.floor !== null) {
    return target.currentValue >= target.floor
  }
  if (target.ceiling !== null) {
    return target.currentValue <= target.ceiling
  }
  return true
}

type TargetValues = Record<string, string>

function buildInitialValues(targets: FinancialTarget[]): TargetValues {
  const values: TargetValues = {}
  for (const t of targets) {
    const raw = t.floor !== null ? t.floor : t.ceiling
    values[t.id] = raw !== null ? String(raw) : ""
  }
  return values
}

function computeScore(targets: FinancialTarget[], values: TargetValues): number {
  if (targets.length === 0) return 0
  let filled = 0
  for (const t of targets) {
    const v = values[t.id]
    if (v !== undefined && v !== "" && !isNaN(Number(v))) {
      filled++
    }
  }
  return (filled / targets.length) * 10
}

export function FinancialTargetsTab({ targets, onScoreChange }: FinancialTargetsTabProps) {
  const [values, setValues] = useState<TargetValues>(() => buildInitialValues(targets))

  const score = computeScore(targets, values)

  const stableOnScoreChange = useCallback(onScoreChange, [onScoreChange])

  useEffect(() => {
    stableOnScoreChange(score)
  }, [score, stableOnScoreChange])

  function handleChange(id: string, raw: string) {
    setValues((prev) => ({ ...prev, [id]: raw }))
  }

  return (
    <div>
      {SECTIONS.map((section, sectionIdx) => {
        const sectionTargets = targets.filter((t) => t.group === section.group)
        if (sectionTargets.length === 0) return null

        return (
          <Card key={section.group} className={cn( sectionIdx > 0 && "mt-8")}>
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <section.Icon className="h-4 w-4" />
              {section.label}
            </h3>
            {sectionTargets.map((target, i) => (
              <div
                key={target.id}
                className={cn(
                  "flex justify-between items-center py-4",
                  i > 0 && "border-t"
                )}
              >
                <div className="w-1/3">
                  <div className="font-medium">{target.metric}</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span
                      className={cn(
                        "font-mono tabular-nums",
                        isHealthy(target) ? "text-success" : "text-destructive"
                      )}
                    >
                      {formatCurrentValue(target.currentValue, target.unit)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {target.floor !== null ? "Floor" : "Ceiling"}
                  </span>
                  <div className="relative">
                    <Input
                      value={values[target.id] ?? ""}
                      onChange={(e) => handleChange(target.id, e.target.value)}
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      {getUnitSuffix(target.unit)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )
      })}
      <p className="text-sm text-muted-foreground mt-6">
        These targets dictate the red/green warning signals across your entire dashboard.
      </p>
    </div>
  )
}
