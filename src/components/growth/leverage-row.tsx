import { Slider } from "@/components/ui/slider"
import { ChevronRight } from "lucide-react"

interface LeverageRowProps {
  label: string
  description: string
  value: number[]
  onValueChange: (val: number[]) => void
  min: number
  max: number
  step: number
  liftAmount: number
  isLast: boolean
  onClick: () => void
}

export function LeverageRow({
  label,
  description,
  value,
  onValueChange,
  min,
  max,
  step,
  liftAmount,
  isLast,
  onClick,
}: LeverageRowProps) {
  return (
    <div
      onClick={onClick}
      className={`group grid grid-cols-subgrid col-span-full items-center gap-x-4 py-4 px-2 -mx-2 rounded-md cursor-pointer transition-colors hover:bg-muted/40 ${
        !isLast ? "border-b border-border/50" : ""
      }`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-muted-foreground truncate">{description}</div>
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Slider
          value={value}
          onValueChange={(val) =>
            onValueChange(Array.isArray(val) ? [...val] : [val])
          }
          min={min}
          max={max}
          step={step}
          className="[&_[data-slot=slider-range]]:bg-brand-500/60"
        />
      </div>
      <div className="text-right text-sm text-success font-medium font-mono tabular-nums transition-all group-hover:drop-shadow-[0_0_6px_oklch(0.627_0.194_149.214/0.4)]">
        +${(liftAmount / 1000).toFixed(1)}K/mo
      </div>
      <div className="flex justify-end">
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-40 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
      </div>
    </div>
  )
}
