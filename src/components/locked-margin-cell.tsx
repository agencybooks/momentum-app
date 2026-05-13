"use client"

import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

interface LockedMarginCellProps {
  margin: number
  mrr: number
  hasTimeTracking: boolean
}

export function LockedMarginCell({ margin, mrr, hasTimeTracking }: LockedMarginCellProps) {
  const router = useRouter()

  if (mrr === 0) {
    return (
      <TableCell className="text-right">
        <span className="tabular-nums font-medium font-mono text-foreground">&mdash;</span>
      </TableCell>
    )
  }

  if (hasTimeTracking) {
    return (
      <TableCell className="text-right">
        <span
          className={cn(
            "tabular-nums font-medium font-mono",
            margin < 0.40
              ? "text-destructive"
              : margin < 0.50
                ? "text-amber-600 dark:text-amber-500"
                : "text-foreground"
          )}
        >
          {`${(margin * 100).toFixed(1)}%`}
        </span>
      </TableCell>
    )
  }

  return (
    <TableCell className="text-right">
      <Popover>
        <PopoverTrigger
          className="inline-flex items-center gap-1.5 cursor-pointer group/lock"
          onClick={(e) => e.stopPropagation()}
          render={<button type="button" />}
        >
          <span className="blur-sm select-none tabular-nums font-medium font-mono text-foreground">
            {`${(margin * 100).toFixed(1)}%`}
          </span>
          <Lock className="w-4 h-4 text-muted-foreground transition-colors group-hover/lock:text-foreground" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          className="z-[60] max-w-[280px] p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <PopoverHeader>
            <PopoverTitle className="text-sm font-semibold">
              Unlock True Margin Diagnostics
            </PopoverTitle>
            <PopoverDescription className="text-xs leading-relaxed mt-1">
              Client-level profitability requires accurate labor costs. Connect
              your team&apos;s Toggl or Harvest account to activate the Margin Engine.
            </PopoverDescription>
          </PopoverHeader>
          <Button
            size="sm"
            className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-500 dark:hover:bg-brand-400"
            onClick={(e) => {
              e.stopPropagation()
              router.push("/settings")
            }}
          >
            Connect Time Tracking
          </Button>
        </PopoverContent>
      </Popover>
    </TableCell>
  )
}
