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

export default function M10Drawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              Operating Margin Analysis
            </SheetTitle>
            <SheetDescription>
              Current: 19.0% | Target: &gt;20%
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Operating margin dropped 2.1pp. OpEx is growing faster than revenue -- Marketing spend surged 23.9% while revenue grew only 9.2%.</span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Mathematical Proof
              </h3>
              <Card className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Profit</span>
                  <span className="font-mono font-medium tabular-nums">$27,555</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Operating Expenses</span>
                  <span className="font-mono font-medium tabular-nums text-destructive">-$17,105</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2 pt-1">
                  <span className="font-medium">= Operating Profit</span>
                  <span className="font-mono font-bold tabular-nums">$10,450</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">&divide; Revenue ($55,000)</span>
                  <span className="font-mono font-bold tabular-nums text-lg">19.0%</span>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                OpEx Breakdown
              </h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-destructive" />
                      <span className="text-foreground">Marketing & Ads</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$1,000</span>
                      <span className="text-xs font-medium text-destructive tabular-nums">+23.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-warning" />
                      <span className="text-foreground">Software Subscriptions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$2,105</span>
                      <span className="text-xs font-medium text-warning tabular-nums">+3.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
                      <span className="text-foreground">Core Payroll</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$14,000</span>
                      <span className="text-xs font-medium text-muted-foreground">—</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )

}