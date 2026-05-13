"use client"

import { useState, useEffect, useCallback, Fragment } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { TeamMember, SoftwareItem } from "@/lib/db/types"

const DEPARTMENTS = ["Delivery", "Marketing", "Sales", "Admin"] as const
type Department = (typeof DEPARTMENTS)[number]

const CATEGORY_OPTIONS = [
  { value: "overhead" as const, label: "Overhead" },
  { value: "shared-delivery" as const, label: "Shared Delivery" },
  { value: "direct-client" as const, label: "Direct Client" },
]

interface MarginAllocationTabProps {
  teamMembers: TeamMember[]
  softwareItems: SoftwareItem[]
  onScoreChange: (score: number) => void
}

interface LocalAllocation {
  [dept: string]: number
}

function getAllocation(
  allocations: LocalAllocation,
  dept: Department
): number {
  return allocations[dept] ?? 0
}

function computeScore(
  software: SoftwareItem[],
  teamAllocations: LocalAllocation[]
): number {
  const categorizedCount = software.filter((s) => s.category !== null).length
  const softwareScore =
    software.length > 0 ? (categorizedCount / software.length) * 5 : 5

  const validTeamCount = teamAllocations.filter((allocs) => {
    const sum = DEPARTMENTS.reduce((s, d) => s + getAllocation(allocs, d), 0)
    const hasAllocation = DEPARTMENTS.some((d) => getAllocation(allocs, d) > 0)
    return sum === 100 && hasAllocation
  }).length

  const teamScore =
    teamAllocations.length > 0
      ? (validTeamCount / teamAllocations.length) * 5
      : 5

  return softwareScore + teamScore
}

export function MarginAllocationTab({
  teamMembers,
  softwareItems,
  onScoreChange,
}: MarginAllocationTabProps) {
  const [software, setSoftware] = useState<SoftwareItem[]>(softwareItems)
  const [teamAllocations, setTeamAllocations] = useState<LocalAllocation[]>(
    () =>
      teamMembers.map((tm) => {
        const allocs: LocalAllocation = {}
        for (const dept of DEPARTMENTS) {
          const found = tm.allocations.find((a) => a.department === dept)
          allocs[dept] = found ? found.percent : 0
        }
        return allocs
      })
  )

  const stableOnScoreChange = useCallback(onScoreChange, [onScoreChange])

  useEffect(() => {
    stableOnScoreChange(computeScore(software, teamAllocations))
  }, [software, teamAllocations, stableOnScoreChange])

  function handleCategoryChange(
    itemId: string,
    category: SoftwareItem["category"]
  ) {
    setSoftware((prev) =>
      prev.map((s) => (s.id === itemId ? { ...s, category } : s))
    )
  }

  function handleAllocationChange(
    memberIndex: number,
    editedDept: Department,
    rawValue: string
  ) {
    setTeamAllocations((prev) => {
      const next = [...prev]
      const allocs = { ...next[memberIndex] }

      let newVal = parseInt(rawValue, 10)
      if (isNaN(newVal)) newVal = 0
      newVal = Math.max(0, Math.min(100, newVal))
      allocs[editedDept] = newVal

      const otherDepts = DEPARTMENTS.filter((d) => d !== editedDept)
      const otherSum = otherDepts.reduce(
        (s, d) => s + getAllocation(allocs, d),
        0
      )
      const total = newVal + otherSum

      if (total !== 100) {
        const diff = total - 100
        // Adjust the last other department alphabetically
        const sortedOthers = [...otherDepts].sort((a, b) =>
          b.localeCompare(a)
        )
        for (const dept of sortedOthers) {
          const current = getAllocation(allocs, dept)
          const adjusted = Math.max(0, Math.min(100, current - diff))
          const actualDiff = current - adjusted
          allocs[dept] = adjusted
          if (actualDiff === diff) break
          // If we couldn't absorb the full diff, continue (edge case)
        }

        // Final clamp pass: if a single field is >100, cap it and zero others
        if (newVal > 100) {
          allocs[editedDept] = 100
          for (const d of otherDepts) allocs[d] = 0
        }
      }

      next[memberIndex] = allocs
      return next
    })
  }

  function getAllocationSum(memberIndex: number): number {
    return DEPARTMENTS.reduce(
      (s, d) => s + getAllocation(teamAllocations[memberIndex], d),
      0
    )
  }

  return (
    <div className="space-y-8">
      {/* Software Cost Triage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Software Cost Triage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Vendor</TableHead>
                <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">
                  Trailing 30-Day Cost
                </TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {software.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(item.category === null && "bg-warning/5")}
                >
                  <TableCell className="font-medium">{item.vendor}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCurrency(item.trailing30DayCost)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            handleCategoryChange(item.id, opt.value)
                          }
                          className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer",
                            item.category === opt.value
                              ? "bg-brand-500/10 text-brand-700 border-brand-500/30 dark:text-brand-300"
                              : "bg-transparent text-muted-foreground border-border hover:bg-accent/50"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team Cost Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground tracking-tight">
            Team Cost Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Employee Name</TableHead>
                <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">Monthly Cost</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Role</TableHead>
                {DEPARTMENTS.map((dept) => (
                  <TableHead key={dept} className="text-center text-sm font-medium text-muted-foreground border-b bg-transparent">
                    {dept}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, idx) => {
                const sum = getAllocationSum(idx)
                return (
                  <Fragment key={member.id}>
                    <TableRow>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground bg-muted/30">
                        {formatCurrency(member.monthlyCost)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.role}
                      </TableCell>
                      {DEPARTMENTS.map((dept) => (
                        <TableCell key={dept} className="text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={getAllocation(
                                teamAllocations[idx],
                                dept
                              )}
                              onChange={(e) =>
                                handleAllocationChange(
                                  idx,
                                  dept,
                                  e.target.value
                                )
                              }
                              className="w-16 text-center text-xs font-mono"
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    {sum !== 100 && (
                      <TableRow>
                        <TableCell
                          colSpan={3 + DEPARTMENTS.length}
                          className="text-destructive text-xs pt-0 pb-1 border-0"
                        >
                          Allocations sum to {sum}% — must equal 100%
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
