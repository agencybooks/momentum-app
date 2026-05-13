"use client"

import { cn } from "@/lib/utils"

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

interface AgingBucket {
  label: string
  amount: number
}

interface AgingBucketsSummaryProps {
  buckets: AgingBucket[]
  totalOutstanding: number
  activeBucket: string | null
  onBucketClick: (label: string) => void
  colorMap?: Record<string, string>
}

const defaultColorMap: Record<string, string> = {
  "60+ Days": "bg-destructive",
  "31-60 Days": "bg-amber-500",
}

export function AgingBucketsSummary({
  buckets,
  totalOutstanding,
  activeBucket,
  onBucketClick,
  colorMap = defaultColorMap,
}: AgingBucketsSummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {buckets.map((bucket) => {
        const isActive = activeBucket === bucket.label
        const barWidth = totalOutstanding > 0
          ? (bucket.amount / totalOutstanding) * 100
          : 0

        return (
          <button
            key={bucket.label}
            onClick={() => onBucketClick(bucket.label)}
            className={cn(
              "flex flex-col gap-1 rounded-md px-3 py-2 text-left transition-colors cursor-pointer",
              "hover:bg-muted/50",
              isActive && "bg-muted ring-1 ring-brand-500/30"
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {bucket.label}
            </span>
            <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
              {currencyFmt.format(bucket.amount)}
            </span>
            <div className="h-[3px] w-full rounded-full bg-muted mt-0.5">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  colorMap[bucket.label] || "bg-brand-500"
                )}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
