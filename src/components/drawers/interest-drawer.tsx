import React from "react"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight, Lightbulb, CheckCircle2, AlertTriangle, Search, Clock, Check, RotateCcw, ChevronDown, CornerDownRight, TrendingUp, Plus, Minus, Equal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function InterestDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Interest & Fees</SheetTitle>
            <SheetDescription>Other Expenses: $1,430/mo | 2.6% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Interest and fees held flat. Line of credit at 7.2% APR with $18K remaining balance.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Debt Service</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Line of Credit Interest", amount: 1080, rate: "7.2% APR" },
                    { name: "Bank Fees (Mercury)", amount: 200, rate: "Fixed" },
                    { name: "Payment Processing", amount: 150, rate: "2.9% + 30¢" },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-foreground">{d.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${d.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{d.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">6-Month Trend</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { month: "Dec", amount: 1430 },
                    { month: "Jan", amount: 1430 },
                    { month: "Feb", amount: 1430 },
                    { month: "Mar", amount: 1430 },
                    { month: "Apr", amount: 1430 },
                    { month: "May", amount: 1430 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-muted-foreground/30" style={{ width: "100%" }} />
                      </div>
                      <span className="font-mono tabular-nums text-foreground font-medium">${m.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )

}