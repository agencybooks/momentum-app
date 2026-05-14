"use client"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type RowType = "positive" | "negative" | "result"

export interface WaterfallRow {
  label: string
  value: number
  displayValue: string
  type: RowType
  left: number
  width: number
  percentLabel?: { pct: string; sub: string; colorClass?: string }
}

export const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export const barStyles: Record<RowType, { bg: string; border: string; text: string }> = {
  positive: {
    bg: "bg-brand-500/10",
    border: "border-brand-500/30",
    text: "text-brand-700 dark:text-brand-300",
  },
  negative: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
  },
  result: {
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
  },
}

export function BarCell({
  row,
  animated,
  delay,
  details,
}: {
  row: WaterfallRow
  animated: boolean
  delay: number
  details?: Array<{ label: string; amount: number }>
}) {
  const style = barStyles[row.type]

  return (
    <div className="relative h-11">
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "absolute top-0 h-full rounded-md border group/bar cursor-default",
            style.bg,
            style.border,
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
            "hover:shadow-md dark:hover:border-border",
            "min-w-[2rem]",
            "flex items-center justify-center"
          )}
          style={{
            left: `${row.left}%`,
            width: animated ? `${row.width}%` : "0%",
            transitionProperty: "width, background-color, box-shadow",
            transitionDuration: "800ms, 300ms, 300ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1), ease, ease",
            transitionDelay: `${delay}ms, 0ms, 0ms`,
          }}
        >
          <div className={cn(
            "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
            row.type === "positive" && "bg-brand-500/10",
            row.type === "negative" && "bg-destructive/10",
            row.type === "result" && "bg-success/10",
            "group-hover/bar:opacity-100"
          )} />

          <span className={cn(
            "relative z-10 font-mono text-sm font-medium tabular-nums whitespace-nowrap",
            style.text,
            "opacity-0 transition-opacity duration-500",
            animated && "opacity-100"
          )}
          style={{ transitionDelay: `${delay + 400}ms` }}
          >
            {row.displayValue}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="block max-w-xs rounded-lg border border-border/50 bg-background px-3 py-2 text-xs text-foreground shadow-xl"
        >
          <div>
            <p className="font-medium">{row.label}</p>
            <p className="font-mono font-medium tabular-nums mt-0.5">
              {row.displayValue}
            </p>
            {details && details.length > 0 && (
              <>
                <div className="border-t border-border/30 my-1.5" />
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between gap-4 py-0.5"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono tabular-nums">
                      {currencyFmt.format(item.amount)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function ConnectorRow({ x, animated, delay }: { x: number; animated: boolean; delay: number }) {
  return (
    <>
      <div />
      <div className="relative h-4">
        <div
          className={cn(
            "absolute top-0 bottom-0 border-l-2 border-dashed border-muted-foreground/40",
            "transition-opacity duration-300",
            animated ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${x}%`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <div />
    </>
  )
}
