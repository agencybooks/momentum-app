"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GlobalDateRangeProps {
  value: string
  onChange: (value: string | null) => void
}

export function GlobalDateRange({ value, onChange }: GlobalDateRangeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] h-10 text-sm font-medium">
        <SelectValue placeholder="Date range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ttm">Trailing 6 Months</SelectItem>
        <SelectItem value="ytd">Year to Date</SelectItem>
        <SelectItem value="custom" disabled>
          Custom Range
          <span className="ml-1.5 text-[10px] text-muted-foreground">Soon</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
