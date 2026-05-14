"use client"

import { Fragment, type ReactNode } from "react"
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
  if (isRevenue) return v.direction === "up" ? "text-success" : "text-destructive"
  return v.direction === "up" ? "text-destructive" : "text-success"
}

function fillColor(categoryId: string) {
  if (categoryId === "rev-total") return "bg-brand-500/10"
  if (categoryId === "cogs-total") return "bg-destructive/10"
  if (categoryId === "opex-total") return "bg-warning/10"
  return "bg-muted-foreground/10"
}

function CellContent({ collapsed, children }: { collapsed: boolean; children: ReactNode }) {
  return (
    <div className={cn(
      "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
      collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
    )}>
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

const cellTransition = "transition-[padding] duration-200 ease-out"

function SubItemRow({
  item,
  categoryId,
  isRevenue,
  collapsed = false,
}: {
  item: PnLSubItem
  categoryId: string
  isRevenue: boolean
  collapsed?: boolean
}) {
  const [, setDrawer] = useQueryState("drawer")

  return (
    <TableRow
      onClick={collapsed ? undefined : () => setDrawer(item.drawerId)}
      className={cn(
        "group transition-colors border-0",
        collapsed ? "pointer-events-none" : "cursor-pointer hover:bg-muted/50"
      )}
      aria-hidden={collapsed || undefined}
    >
      <TableCell className={cn("pl-8 pr-4", cellTransition, collapsed ? "py-0" : "py-3")}>
        <CellContent collapsed={collapsed}>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {item.name}
          </span>
        </CellContent>
      </TableCell>
      <TableCell className={cn("px-4 text-right font-mono tabular-nums text-sm text-muted-foreground", cellTransition, collapsed ? "py-0" : "py-3")}>
        <CellContent collapsed={collapsed}>
          {currencyFmt.format(item.amount)}
        </CellContent>
      </TableCell>
      <TableCell className={cn("px-4 text-right tabular-nums text-sm font-medium", cellTransition, collapsed ? "py-0" : "py-3", varianceColor(item.variance, isRevenue))}>
        <CellContent collapsed={collapsed}>
          {formatVariance(item.variance)}
        </CellContent>
      </TableCell>
      <TableCell className={cn("px-4", cellTransition, collapsed ? "py-0" : "py-3")}>
        <CellContent collapsed={collapsed}>
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
        </CellContent>
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
    <div>
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent py-3 px-4">
            Category
          </TableHead>
          <TableHead className="w-[110px] text-right text-sm font-medium text-muted-foreground border-b bg-transparent py-3 px-4">
            May 2026
          </TableHead>
          <TableHead className="w-[90px] text-right text-sm font-medium text-muted-foreground border-b bg-transparent py-3 px-4">
            vs April
          </TableHead>
          <TableHead className="w-[80px] text-right text-sm font-medium text-muted-foreground border-b bg-transparent py-3 px-4">
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
            const isNetIncome = cat.highlightColor === "success"
            return (
              <TableRow
                key={cat.id}
                className={cn(
                  "group border-0",
                  isNetIncome ? "border-t-2 border-border" : "border-t border-border",
                  highlightDrawerId && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={highlightDrawerId ? () => setDrawer(highlightDrawerId) : undefined}
              >
                <TableCell className={cn(
                  "py-4 px-4",
                  isNetIncome ? "font-bold text-success dark:text-success" : "font-semibold text-brand-500 dark:text-brand-400"
                )}>{cat.name}</TableCell>
                <TableCell className={cn(
                  "py-4 px-4 text-right font-mono tabular-nums",
                  isNetIncome ? "font-bold text-success dark:text-success" : "font-semibold text-brand-500 dark:text-brand-400"
                )}>
                  {currencyFmt.format(cat.amount)}
                </TableCell>
                <TableCell className={cn(
                  "py-4 px-4 text-right tabular-nums text-sm",
                  isNetIncome ? "font-bold" : "font-semibold"
                )}>
                  {cat.variance && (
                    <span className={varianceColor(cat.variance, true)}>
                      {formatVariance(cat.variance)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="relative overflow-hidden rounded-sm">
                    {revenue > 0 && (
                      <div
                        className={cn(
                          "absolute inset-y-0 right-0",
                          isNetIncome ? "bg-success/12" : "bg-brand-500/12"
                        )}
                        style={{ width: `${Math.min((Math.abs(cat.amount) / revenue) * 100, 100)}%` }}
                      />
                    )}
                    <span className={cn(
                      "relative text-sm font-mono tabular-nums text-right block",
                      isNetIncome ? "font-bold text-success dark:text-success" : "font-semibold text-brand-500 dark:text-brand-400"
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
                  catDrawerId ? "cursor-pointer hover:bg-muted/50" : "hover:bg-transparent",
                  !showChildren && !isSummationRow && "border-b border-border/30",
                  isSummationRow && "border-t border-border"
                )}
                onClick={catDrawerId ? () => setDrawer(catDrawerId) : undefined}
              >
                <TableCell className={cn(
                  "py-4 px-4 text-foreground",
                  isRevenueRow ? "font-bold" : "font-semibold"
                )}>
                  {cat.name}
                </TableCell>
                <TableCell className={cn(
                  "py-4 px-4 text-right font-mono tabular-nums text-foreground",
                  isRevenueRow ? "font-bold" : "font-semibold"
                )}>
                  {currencyFmt.format(cat.amount)}
                </TableCell>
                <TableCell className="py-4 px-4 text-right tabular-nums text-sm font-semibold">
                  {cat.variance && (
                    <span className={varianceColor(cat.variance, isRevenue)}>
                      {formatVariance(cat.variance)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">
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
              {hasChildren &&
                cat.children.map((child) => (
                  <SubItemRow
                    key={child.id}
                    item={child}
                    categoryId={cat.id}
                    isRevenue={isRevenue}
                    collapsed={!showChildren}
                  />
                ))}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
    </div>
  )
}
