"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { LeverageRow } from "./leverage-row"
import { CommitFooter } from "./commit-footer"
import { LeverageDeepDiveDrawer } from "@/components/drawers/leverage-deep-dive-drawer"

type LeverKey = "acquire" | "expand" | "dealSize" | "retain"

interface LeverConfig {
  key: LeverKey
  label: string
  min: number
  max: number
  step: number
  multiplier: number
  descriptionFn: (val: number) => string
}

const LEVERS: LeverConfig[] = [
  {
    key: "acquire",
    label: "1. ACQUIRE",
    min: 0,
    max: 10,
    step: 0.5,
    multiplier: 5000,
    descriptionFn: (v) => `Target: ${v.toFixed(1)} logos/mo`,
  },
  {
    key: "expand",
    label: "2. EXPAND",
    min: 0,
    max: 20,
    step: 1,
    multiplier: 600,
    descriptionFn: (v) => `Lift book by ${v}%`,
  },
  {
    key: "dealSize",
    label: "3. DEAL SIZE",
    min: 0,
    max: 50,
    step: 1,
    multiplier: 260,
    descriptionFn: (v) => `Target: +${v}% avg`,
  },
  {
    key: "retain",
    label: "4. RETAIN",
    min: 0,
    max: 5,
    step: 0.5,
    multiplier: 300,
    descriptionFn: (v) => `Target: -${v.toFixed(1)}pt churn`,
  },
]

const DEFAULTS: Record<LeverKey, number[]> = {
  acquire: [2.0],
  expand: [5.0],
  dealSize: [10.0],
  retain: [1.0],
}

export function LeverageMatrix() {
  const [values, setValues] = useState<Record<LeverKey, number[]>>(DEFAULTS)
  const [activeDrawer, setActiveDrawer] = useState<LeverKey | null>(null)
  const lastDrawerRef = useRef<LeverKey>("acquire")

  if (activeDrawer) {
    lastDrawerRef.current = activeDrawer
  }

  const lifts = Object.fromEntries(
    LEVERS.map((l) => [l.key, values[l.key][0] * l.multiplier])
  ) as Record<LeverKey, number>

  const totalLift = Object.values(lifts).reduce((sum, v) => sum + v, 0)
  const targetArr = 310000 + totalLift * 12

  const updateValue = (key: LeverKey, val: number[]) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const drawerKey = activeDrawer ?? lastDrawerRef.current

  return (
    <Card>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        THE LEVERAGE MATRIX
      </div>
      <div className="flex items-center gap-4 text-sm font-medium mb-8">
        <span>Current Plateau: $310K ARR</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-primary font-bold">
          TARGET PLATEAU: ${(targetArr / 1000).toFixed(0)}K ARR
        </span>
      </div>

      <div className="grid grid-cols-[7rem_minmax(8rem,1fr)_minmax(120px,2fr)_6rem_2rem]">
        {LEVERS.map((lever, i) => (
          <LeverageRow
            key={lever.key}
            label={lever.label}
            description={lever.descriptionFn(values[lever.key][0])}
            value={values[lever.key]}
            onValueChange={(val) => updateValue(lever.key, val)}
            min={lever.min}
            max={lever.max}
            step={lever.step}
            liftAmount={lifts[lever.key]}
            isLast={i === LEVERS.length - 1}
            onClick={() => setActiveDrawer(lever.key)}
          />
        ))}
      </div>

      <CommitFooter totalLift={totalLift} />

      <LeverageDeepDiveDrawer
        leverKey={drawerKey}
        value={values[drawerKey]}
        onValueChange={(val) => updateValue(drawerKey, val)}
        liftAmount={lifts[drawerKey]}
        open={!!activeDrawer}
        onOpenChange={(open) => {
          if (!open) setActiveDrawer(null)
        }}
      />
    </Card>
  )
}
