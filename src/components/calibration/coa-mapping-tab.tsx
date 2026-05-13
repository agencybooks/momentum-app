"use client"

import { useState, useCallback } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/format"
import type { COAAccount } from "@/lib/db/types"
import { COA_GROUPS, COA_SUB_CATEGORIES } from "@/lib/db/calibration-data"

interface COAMappingTabProps {
  accounts: COAAccount[]
  onScoreChange: (score: number) => void
}

export function COAMappingTab({ accounts: initialAccounts, onScoreChange }: COAMappingTabProps) {
  const [accounts, setAccounts] = useState<COAAccount[]>(initialAccounts)

  const computeScore = useCallback(
    (accts: COAAccount[]) => (accts.filter((a) => a.group !== null).length / accts.length) * 15,
    [],
  )

  const handleGroupChange = (id: string, group: string) => {
    const next = accounts.map((a) =>
      a.id === id ? { ...a, group, floatingAmount: 0 } : a,
    )
    setAccounts(next)
    onScoreChange(computeScore(next))

    const wasAllMapped = accounts.every((a) => a.group !== null)
    const isNowAllMapped = next.every((a) => a.group !== null)
    if (!wasAllMapped && isNowAllMapped) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })
    }
  }

  const handleSubCategoryChange = (id: string, subCategory: string) => {
    const next = accounts.map((a) =>
      a.id === id ? { ...a, subCategory } : a,
    )
    setAccounts(next)
    onScoreChange(computeScore(next))
  }

  const sorted = [...accounts].sort((a, b) => {
    if (a.group === null && b.group !== null) return -1
    if (a.group !== null && b.group === null) return 1
    return 0
  })

  const mapped = accounts.filter((a) => a.group !== null).length
  const unmapped = accounts.filter((a) => a.group === null)
  const unmappedCount = unmapped.length
  const unmappedTotal = unmapped.reduce((sum, a) => sum + a.floatingAmount, 0)
  const total = accounts.length

  return (
    <div>
      {unmappedCount > 0 && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-start gap-3 mb-6">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-1">
              Action Required: {formatCurrency(unmappedTotal)} Floating in {unmappedCount} Unmapped Account{unmappedCount !== 1 ? "s" : ""}
            </strong>
            Assign a Momentum Group and Sub-Category to classify this spend.
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <Card className="flex items-center gap-3 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-sm font-semibold">
            {mapped} / {total} MAPPED ACCOUNTS
          </span>
        </Card>
        {unmappedCount > 0 && (
          <Card className="flex items-center gap-3 px-4 py-3 border-destructive/30">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-semibold text-destructive">
              {unmappedCount} UNMAPPED ACCOUNTS
            </span>
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {formatCurrency(unmappedTotal)} floating
            </span>
          </Card>
        )}
      </div>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">QBO Account</TableHead>
            <TableHead className="text-right text-sm font-medium text-muted-foreground border-b bg-transparent">YTD Total</TableHead>
            <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Momentum Group</TableHead>
            <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Sub-Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((account) => {
            const isUnmapped = account.group === null
            return (
              <TableRow key={account.id}>
                <TableCell className={isUnmapped ? "font-medium text-destructive" : "font-medium"}>
                  #{account.accountNumber} {account.accountName}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatCurrency(account.ytdTotal)}
                </TableCell>
                <TableCell>
                  <Select
                    value={account.group ?? ""}
                    onValueChange={(val) => handleGroupChange(account.id, val as string)}
                  >
                    <SelectTrigger
                      className={`w-[180px] h-8 text-xs ${isUnmapped ? "border-destructive text-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {COA_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={account.subCategory ?? ""}
                    onValueChange={(val) => handleSubCategoryChange(account.id, val as string)}
                    disabled={account.group === null}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {COA_SUB_CATEGORIES.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
