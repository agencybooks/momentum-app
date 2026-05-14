"use client"

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const compactCurrency = (v: number) => `$${(v / 1000).toFixed(1)}K`

interface VarianceLedgerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
  dataKey: string
  format: "currency" | "percent" | "months" | "multiplier" | "days"
  downIsGood: boolean
}

export function VarianceLedger({ data, dataKey, format, downIsGood }: VarianceLedgerProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Period Comparison
      </h3>
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-16">Month</th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">Value</th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 w-24">MoM Δ</th>
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((point, i) => {
            const originalIndex = data.length - 1 - i
            const value = point[dataKey] as number
            const prevValue = originalIndex > 0 ? (data[originalIndex - 1][dataKey] as number) : null

            let formattedValue: string
            let delta: string
            let deltaColor: string

            if (format === "percent") {
              formattedValue = `${(value * 100).toFixed(1)}%`
            } else if (format === "currency") {
              formattedValue = currencyFmt.format(value)
            } else if (format === "months") {
              formattedValue = `${value.toFixed(1)} mo`
            } else if (format === "days") {
              formattedValue = `${value.toFixed(0)} d`
            } else {
              formattedValue = `${value.toFixed(1)}x`
            }

            if (prevValue === null) {
              delta = "—"
              deltaColor = "text-muted-foreground"
            } else {
              const diff = value - prevValue
              const isPositiveChange = downIsGood ? diff < 0 : diff > 0
              const isNeutral = diff === 0

              if (format === "percent") {
                delta = `${diff >= 0 ? "+" : ""}${(diff * 100).toFixed(1)}pp`
              } else if (format === "currency") {
                delta = diff >= 0
                  ? `+${compactCurrency(diff)}`
                  : `-${compactCurrency(Math.abs(diff))}`
              } else if (format === "months") {
                delta = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} mo`
              } else if (format === "days") {
                delta = `${diff >= 0 ? "+" : ""}${diff.toFixed(0)} d`
              } else {
                delta = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}x`
              }

              deltaColor = isNeutral
                ? "text-muted-foreground"
                : isPositiveChange
                ? "text-success"
                : "text-destructive"
            }

            return (
              <tr
                key={point.month as string}
                className="border-b border-border/30 last:border-0 transition-colors hover:bg-accent/30"
              >
                <td className="py-2 font-mono tabular-nums text-muted-foreground">
                  {point.month as string}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {formattedValue}
                </td>
                <td className={`py-2 text-right font-mono tabular-nums ${deltaColor}`}>
                  {delta}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
