"use client"

import { Fragment } from "react"
import { useQueryState } from "nuqs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { PnLCategory, PnLSubItem } from "@/lib/db/types"

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function formatVariance(v: { percent: number; direction: "up" | "flat" | "down" }) {
  if (v.direction === "flat" || v.percent === 0) return "—"
  return `${v.direction === "up" ? "+" : "-"}${v.percent.toFixed(1)}%`
}

function varianceColor(v: { percent: number; direction: "up" | "flat" | "down" }, isRevenue: boolean) {
  if (v.direction === "flat" || v.percent === 0) return "text-muted-foreground"
  if (isRevenue) return v.direction === "up" ? "text-emerald-500" : "text-destructive"
  return v.direction === "up" ? "text-destructive" : "text-emerald-500"
}

function fillColor(categoryId: string) {
  if (categoryId === "rev-total") return "bg-brand-500/10"
  if (categoryId === "cogs-total") return "bg-destructive/10"
  if (categoryId === "opex-total") return "bg-amber-500/10"
  return "bg-muted-foreground/10"
}

function SubItemRow({
  item,
  categoryId,
  isRevenue,
}: {
  item: PnLSubItem
  categoryId: string
  isRevenue: boolean
}) {
  const [, setDrawer] = useQueryState("drawer")

  return (
    <TableRow
      onClick={() => setDrawer(item.drawerId)}
      className="group cursor-pointer hover:bg-muted/30 transition-colors border-0"
    >
      <TableCell className="py-3 pl-10 pr-6">
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {item.name}
        </span>
      </TableCell>
      <TableCell className="py-3 px-6 text-right font-mono tabular-nums text-sm text-muted-foreground">
        {currencyFmt.format(item.amount)}
      </TableCell>
      <TableCell className={cn("py-3 px-6 text-right tabular-nums text-sm font-medium", varianceColor(item.variance, isRevenue))}>
        {formatVariance(item.variance)}
      </TableCell>
      <TableCell className="py-3 px-6">
        <div className="relative overflow-hidden rounded-sm">
          {item.revenueWeight > 0 && (
            <div
              className={cn("absolute inset-y-0 right-0", fillColor(categoryId))}
              style={{ width: `${Math.min(item.revenueWeight * 100, 100)}%` }}
            />
          )}
          <span className="relative text-sm font-mono tabular-nums text-muted-foreground text-right block">
            {item.revenueWeight > 0
              ? `${(item.revenueWeight * 100).toFixed(1)}%`
              : "—"}
          </span>
        </div>
      </TableCell>
    </TableRow>
  )
}

const categoryTrendMap: Record<string, string> = {
  "rev-total": "revenue-trend",
  "cogs-total": "cogs-trend",
  "gp-total": "gross-profit-trend",
}

interface PnlTableProps {
  categories: PnLCategory[]
  revenue: number
  view: "summary" | "detailed"
}

export function PnlTable({ categories, revenue, view }: PnlTableProps) {
  const [, setDrawer] = useQueryState("drawer")

  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-6">
            Category
          </TableHead>
          <TableHead className="w-[140px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-6">
            May 2026
          </TableHead>
          <TableHead className="w-[120px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-6">
            vs April
          </TableHead>
          <TableHead className="w-[100px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-6">
            % Rev
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => {
          const hasChildren = cat.children.length > 0
          const isRevenue = cat.id === "rev-total"

          if (cat.isHighlight) {
            const highlightDrawerId = categoryTrendMap[cat.id]
            const isNetIncome = cat.highlightColor === "emerald"
            return (
              <TableRow
                key={cat.id}
                className={cn(
                  "group border-0",
                  isNetIncome ? "border-t-2 border-border" : "border-t border-border",
                  highlightDrawerId && "cursor-pointer hover:bg-muted/30"
                )}
                onClick={highlightDrawerId ? () => setDrawer(highlightDrawerId) : undefined}
              >
                <TableCell className={cn(
                  "py-3.5 px-6",
                  isNetIncome ? "font-bold text-emerald-600 dark:text-emerald-500" : "font-semibold text-brand-500 dark:text-brand-400"
                )}>{cat.name}</TableCell>
                <TableCell className={cn(
                  "py-3.5 px-6 text-right font-mono tabular-nums",
                  isNetIncome ? "font-bold text-emerald-600 dark:text-emerald-500" : "font-semibold text-brand-500 dark:text-brand-400"
                )}>
                  {currencyFmt.format(cat.amount)}
                </TableCell>
                <TableCell className={cn(
                  "py-3.5 px-6 text-right tabular-nums text-sm",
                  isNetIncome ? "font-bold" : "font-semibold"
                )}>
                  {cat.variance && (
                    <span className={varianceColor(cat.variance, true)}>
                      {formatVariance(cat.variance)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <div className="relative overflow-hidden rounded-sm">
                    {revenue > 0 && (
                      <div
                        className={cn(
                          "absolute inset-y-0 right-0",
                          isNetIncome ? "bg-emerald-500/12" : "bg-brand-500/12"
                        )}
                        style={{ width: `${Math.min((Math.abs(cat.amount) / revenue) * 100, 100)}%` }}
                      />
                    )}
                    <span className={cn(
                      "relative text-sm font-mono tabular-nums text-right block",
                      isNetIncome ? "font-bold text-emerald-600 dark:text-emerald-500" : "font-semibold text-brand-500 dark:text-brand-400"
                    )}>
                      {revenue > 0
                        ? `${((Math.abs(cat.amount) / revenue) * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          }

          const showChildren = view === "detailed" && hasChildren
          const catDrawerId = categoryTrendMap[cat.id]
          const isSummationRow = cat.id === "op-total"
          const isRevenueRow = cat.id === "rev-total"

          return (
            <Fragment key={cat.id}>
              <TableRow
                className={cn(
                  "group transition-colors border-0",
                  catDrawerId ? "cursor-pointer hover:bg-muted/30" : "hover:bg-transparent",
                  !showChildren && !isSummationRow && "border-b border-border/40",
                  isSummationRow && "border-t border-border"
                )}
                onClick={catDrawerId ? () => setDrawer(catDrawerId) : undefined}
              >
                <TableCell className={cn(
                  "py-3.5 px-6 text-foreground",
                  isRevenueRow ? "font-bold" : "font-semibold"
                )}>
                  {cat.name}
                </TableCell>
                <TableCell className={cn(
                  "py-3.5 px-6 text-right font-mono tabular-nums text-foreground",
                  isRevenueRow ? "font-bold" : "font-semibold"
                )}>
                  {currencyFmt.format(cat.amount)}
                </TableCell>
                <TableCell className="py-3.5 px-6 text-right tabular-nums text-sm font-semibold">
                  {cat.variance && (
                    <span className={varianceColor(cat.variance, isRevenue)}>
                      {formatVariance(cat.variance)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <div className="relative overflow-hidden rounded-sm">
                    {revenue > 0 && (
                      <div
                        className={cn("absolute inset-y-0 right-0", fillColor(cat.id))}
                        style={{ width: `${Math.min((Math.abs(cat.amount) / revenue) * 100, 100)}%` }}
                      />
                    )}
                    <span className="relative text-sm font-mono tabular-nums font-semibold text-muted-foreground text-right block">
                      {revenue > 0
                        ? `${((Math.abs(cat.amount) / revenue) * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              {showChildren &&
                cat.children.map((child) => (
                  <SubItemRow
                    key={child.id}
                    item={child}
                    categoryId={cat.id}
                    isRevenue={isRevenue}
                  />
                ))}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}
