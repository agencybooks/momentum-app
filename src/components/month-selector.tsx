"use client"

import { useQueryState } from "nuqs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function MonthSelector() {
  const [month, setMonth] = useQueryState("month", { defaultValue: "May 2026" })

  return (
    <Select value={month} onValueChange={(val) => { setMonth(val) }}>
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="May 2026">May 2026</SelectItem>
        <SelectItem value="Apr 2026">Apr 2026</SelectItem>
        <SelectItem value="Mar 2026">Mar 2026</SelectItem>
      </SelectContent>
    </Select>
  )
}
