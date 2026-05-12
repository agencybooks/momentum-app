"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PERIOD_OPTIONS } from "@/lib/period-utils"

interface DrawerPeriodSelectorProps {
  value: string
  onValueChange: (value: string) => void
  periodAverage?: string
}

export function DrawerPeriodSelector({ value, onValueChange, periodAverage }: DrawerPeriodSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <Tabs value={value} onValueChange={(v) => onValueChange(String(v))}>
          <TabsList variant="drawer-period">
            {PERIOD_OPTIONS.map((option) => (
              <TabsTrigger key={option} value={option}>
                {option}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {periodAverage != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-sm">Period Average:</span>
            <span className="text-foreground font-medium text-sm tabular-nums">{periodAverage}</span>
          </div>
        )}
      </div>
    </div>
  )
}
