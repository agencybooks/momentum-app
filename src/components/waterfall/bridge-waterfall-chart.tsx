"use client"

import { useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type WaterfallRow, type RowType, BarCell, ConnectorRow, currencyFmt } from "./shared"
import { cn } from "@/lib/utils"

export interface BridgeStep {
  label: string
  value: number
  type: "start" | "add" | "subtract" | "end"
  details?: Array<{ label: string; amount: number }>
}

interface BridgeWaterfallProps {
  steps: BridgeStep[]
}

function typeToRowType(stepType: BridgeStep["type"]): RowType {
  switch (stepType) {
    case "start": return "positive"
    case "add": return "positive"
    case "subtract": return "negative"
    case "end": return "result"
  }
}

function buildBridgeRows(steps: BridgeStep[]): { rows: WaterfallRow[]; connectors: number[] } {
  if (steps.length === 0) return { rows: [], connectors: [] }

  const startValue = steps[0].value
  let running = startValue

  const cumulatives: number[] = [running]
  for (let i = 1; i < steps.length; i++) {
    const step = steps[i]
    if (step.type === "end") {
      cumulatives.push(step.value)
    } else {
      running += step.value
      cumulatives.push(running)
    }
  }

  const maxValue = Math.max(...cumulatives, startValue)
  if (maxValue === 0) return { rows: [], connectors: [] }

  const rows: WaterfallRow[] = []
  const connectors: number[] = []
  let prevRunning = startValue

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const rowType = typeToRowType(step.type)

    let left: number
    let width: number
    let displayValue: string
    let percentLabel: WaterfallRow["percentLabel"]

    if (step.type === "start") {
      left = 0
      width = (step.value / maxValue) * 100
      displayValue = currencyFmt.format(step.value)
      percentLabel = { pct: "100%", sub: "STARTING" }
    } else if (step.type === "end") {
      left = 0
      width = (step.value / maxValue) * 100
      displayValue = currencyFmt.format(step.value)
      const netChange = ((step.value - startValue) / startValue) * 100
      const sign = netChange >= 0 ? "+" : ""
      percentLabel = {
        pct: `${sign}${netChange.toFixed(1)}%`,
        sub: "NET CHANGE",
        colorClass: netChange >= 0 ? "text-success" : "text-destructive",
      }
    } else if (step.type === "add") {
      left = (prevRunning / maxValue) * 100
      width = (step.value / maxValue) * 100
      displayValue = `+${currencyFmt.format(step.value)}`
      const pct = ((step.value / startValue) * 100).toFixed(0)
      percentLabel = { pct: `+${pct}%`, sub: "OF START" }
    } else {
      const absVal = Math.abs(step.value)
      const newRunning = prevRunning + step.value
      left = (newRunning / maxValue) * 100
      width = (absVal / maxValue) * 100
      displayValue = `-${currencyFmt.format(absVal)}`
      const pct = ((absVal / startValue) * 100).toFixed(0)
      percentLabel = { pct: `-${pct}%`, sub: "OF START" }
    }

    rows.push({
      label: step.label,
      value: step.value,
      displayValue,
      type: rowType,
      left,
      width,
      percentLabel,
    })

    if (i < steps.length - 1) {
      if (step.type === "start" || step.type === "add") {
        const currentRunning = step.type === "start" ? step.value : prevRunning + step.value
        connectors.push((currentRunning / maxValue) * 100)
      } else if (step.type === "subtract") {
        const currentRunning = prevRunning + step.value
        connectors.push((currentRunning / maxValue) * 100)
      }
    }

    if (step.type === "start") {
      prevRunning = step.value
    } else if (step.type !== "end") {
      prevRunning += step.value
    }
  }

  return { rows, connectors }
}

export function BridgeWaterfallChart({ steps }: BridgeWaterfallProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const { rows, connectors } = buildBridgeRows(steps)

  if (rows.length === 0) return null

  return (
    <TooltipProvider>
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: "minmax(80px, 130px) 1fr auto",
        }}
      >
        {rows.map((row, i) => {
          const stepDetails = steps[i]?.details

          return (
            <div key={row.label} className="contents">
              <div className={
                row.type === "negative"
                  ? "text-sm pr-3 truncate text-right text-muted-foreground"
                  : "text-sm pr-3 truncate text-right font-medium text-foreground"
              }>
                {row.label}
              </div>

              <BarCell
                row={row}
                animated={animated}
                delay={i * 100}
                details={stepDetails}
              />

              <div className="pl-2 min-w-[60px]">
                {row.percentLabel ? (
                  <div className="text-right">
                    <div className={cn("text-sm font-semibold tabular-nums", row.percentLabel.colorClass)}>{row.percentLabel.pct}</div>
                    <div className="text-xs tracking-wider text-muted-foreground">{row.percentLabel.sub}</div>
                  </div>
                ) : null}
              </div>

              {i < rows.length - 1 && (
                <ConnectorRow
                  x={connectors[i]}
                  animated={animated}
                  delay={(i + 1) * 100}
                />
              )}
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
