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

export default function M5Drawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              Gross Margin Engine
            </SheetTitle>
            <SheetDescription className="mt-1">
              Current: 50.1% (Trailing 3 Months)
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-success/20 bg-success/5 dark:bg-success/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <TrendingUp className="w-4 h-4 text-success dark:text-success mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-success dark:text-success">
                Margin improved by 1.8 points. Revenue expansion successfully outpaced fixed infrastructure costs.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Margin Calculation
              </h3>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$41.5K</span>
                </div>
                <Minus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0 justify-self-center" />
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">Total COGS</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$20.7K</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0 justify-self-center" />
                <div className="flex flex-col gap-1 items-center justify-self-center">
                  <span className="text-xs text-muted-foreground">Gross Profit</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$20.8K</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                COGS Variance
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/30 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">AWS Hosting</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$6,200</span>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20 shadow-none">+15%</Badge>
                  </div>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/30 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Stripe Fees</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$1,200</span>
                    <Badge variant="secondary" className="bg-warning/10 text-warning dark:text-warning border-transparent hover:bg-warning/20 shadow-none">+4%</Badge>
                  </div>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Labor</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$13,308</span>
                    <Badge variant="secondary" className="bg-accent text-muted-foreground border-transparent shadow-none">—</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )

}