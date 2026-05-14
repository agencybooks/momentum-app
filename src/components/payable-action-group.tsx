"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PayableStatus = "idle" | "paid" | "scheduled"

interface PayableActionGroupProps {
  canDelay: boolean
  status: PayableStatus
  onPay: () => void
  onSchedule: () => void
  onDelay: () => void
}

export function PayableActionGroup({
  canDelay,
  status,
  onPay,
  onSchedule,
  onDelay,
}: PayableActionGroupProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="xs"
        className={cn(
          "text-xs px-2",
          status === "paid" && "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30"
        )}
        onClick={(e) => { e.stopPropagation(); onPay() }}
      >
        {status === "paid" ? "Paid" : "Pay"}
      </Button>
      <Button
        variant="outline"
        size="xs"
        className={cn(
          "text-xs px-2",
          status === "scheduled" && "bg-warning/10 text-warning border-amber-500/30"
        )}
        onClick={(e) => { e.stopPropagation(); onSchedule() }}
      >
        {status === "scheduled" ? "Scheduled" : "Schedule"}
      </Button>
      <Button
        variant="outline"
        size="xs"
        className="text-xs px-2"
        disabled={!canDelay}
        onClick={(e) => { e.stopPropagation(); onDelay() }}
      >
        Delay
      </Button>
    </div>
  )
}
