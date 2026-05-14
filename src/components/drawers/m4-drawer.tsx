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

export default function M4Drawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              MRR Movement
            </SheetTitle>
            <SheetDescription className="mt-1">
              This Month (May 2026) vs Last Month
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-success/20 bg-success/5 dark:bg-success/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <TrendingUp className="w-4 h-4 text-success dark:text-success mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-success dark:text-success">
                Revenue grew by $3.5K (+9.2%). Entirely driven by expansion.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Revenue Bridge
              </h3>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">April Rev</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$38.0K</span>
                </div>
                <Plus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0 justify-self-center" />
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">Gains</span>
                  <span className="text-sm font-medium tabular-nums text-success">+$3.5K</span>
                </div>
                <Minus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0 justify-self-center" />
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">Losses</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$0</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0 justify-self-center" />
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">May Rev</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$41.5K</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                Deal Ledger
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-foreground">Acme Co.</span>
                    <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider bg-accent text-muted-foreground rounded-md">Scope Expansion</Badge>
                  </div>
                  <span className="text-success dark:text-success font-medium text-sm tabular-nums font-mono">+$2,500</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-foreground">Brightline SaaS</span>
                    <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider bg-accent text-muted-foreground rounded-md">Rate Hike</Badge>
                  </div>
                  <span className="text-success dark:text-success font-medium text-sm tabular-nums font-mono">+$1,000</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )

}