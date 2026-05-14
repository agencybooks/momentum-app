"use client"

import { useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type WaterfallRow, BarCell, ConnectorRow, currencyFmt } from "./shared"

interface PremiumWaterfallProps {
  data: {
    revenue: number
    cogs: number
    grossProfit: number
    expenses: number
    netProfit: number
  }
  details?: {
    cogs: Array<{ label: string; amount: number }>
    expenses: Array<{ label: string; amount: number }>
  }
}

interface InternalRow extends WaterfallRow {
  detailKey?: "cogs" | "expenses"
}

function buildRows(data: PremiumWaterfallProps["data"]): InternalRow[] {
  const R = data.revenue
  if (R === 0) return []

  const gpPct = (data.grossProfit / R) * 100
  const cogsPct = (data.cogs / R) * 100
  const expPct = (data.expenses / R) * 100
  const npPct = Math.max(0, (data.netProfit / R) * 100)

  return [
    {
      label: "Revenue",
      value: data.revenue,
      displayValue: currencyFmt.format(data.revenue),
      type: "positive",
      left: 0,
      width: 100,
      percentLabel: { pct: "100%", sub: "OF REVENUE" },
    },
    {
      label: "Cost of Goods",
      value: data.cogs,
      displayValue: `-${currencyFmt.format(data.cogs)}`,
      type: "negative",
      left: gpPct,
      width: cogsPct,
      detailKey: "cogs",
    },
    {
      label: "Gross Profit",
      value: data.grossProfit,
      displayValue: currencyFmt.format(data.grossProfit),
      type: "result",
      left: 0,
      width: gpPct,
      percentLabel: { pct: `${gpPct.toFixed(1)}%`, sub: "REMAINING" },
    },
    {
      label: "Expenses",
      value: data.expenses,
      displayValue: `-${currencyFmt.format(data.expenses)}`,
      type: "negative",
      left: npPct,
      width: expPct,
      detailKey: "expenses",
    },
    {
      label: "Net Profit",
      value: data.netProfit,
      displayValue: currencyFmt.format(data.netProfit),
      type: "result",
      left: 0,
      width: npPct,
      percentLabel: { pct: `${npPct.toFixed(1)}%`, sub: "REMAINING" },
    },
  ]
}

function buildConnectors(data: PremiumWaterfallProps["data"]): number[] {
  const R = data.revenue
  if (R === 0) return []

  const gpPct = (data.grossProfit / R) * 100
  const npPct = Math.max(0, (data.netProfit / R) * 100)

  return [100, gpPct, gpPct, npPct]
}

export function PremiumWaterfallChart({ data, details }: PremiumWaterfallProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const rows = buildRows(data)
  const connectors = buildConnectors(data)

  if (rows.length === 0) return null

  return (
    <TooltipProvider>
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: "minmax(80px, 120px) 1fr auto",
        }}
      >
        {rows.map((row, i) => {
          const rowDetails = row.detailKey ? details?.[row.detailKey] : undefined

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
                details={rowDetails}
              />

              <div className="pl-2 min-w-[60px]">
                {row.percentLabel ? (
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">{row.percentLabel.pct}</div>
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
