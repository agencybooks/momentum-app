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

export default function M6Drawer() {
  return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>CHURN & REVENUE MOVEMENT</SheetTitle><SheetDescription>Trailing 12 Months (Jun 2025 - May 2026)</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-8">
            <div className="bg-success/10 text-success border border-success/20 p-4 rounded-md text-sm flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-success" /><div><strong className="block mb-1 text-success">Quiet 12 Months</strong>0.9% average monthly churn, well under your 5% threshold. Only 1 client lost ($91K LTV impact).</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">The MRR Bridge</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <div className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">GAINS</div>
                  <div className="space-y-3 font-mono tabular-nums text-sm">
                    <div className="flex justify-between text-success"><span>+ New MRR</span><span>+$115.0K</span></div>
                    <div className="flex justify-between text-success border-b pb-3 border-border/50"><span>+ Expansion</span><span>+$74.5K</span></div>
                    <div className="flex justify-between pt-1 font-bold font-sans text-base"><span>Total</span><span className="text-success">+$189.5K</span></div>
                  </div>
                </div>
                <div className="border rounded-xl p-5">
                  <div className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">LOSSES</div>
                  <div className="space-y-3 font-mono tabular-nums text-sm">
                    <div className="flex justify-between text-destructive"><span>- Contraction</span><span>-$36.0K</span></div>
                    <div className="flex justify-between text-destructive border-b pb-3 border-border/50"><span>- Churned</span><span>-$91.0K</span></div>
                    <div className="flex justify-between pt-1 font-bold font-sans text-base"><span>Total</span><span className="text-destructive">-$127.0K</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-5 bg-muted/30 rounded-xl flex justify-between items-center border"><span className="font-semibold text-lg tracking-tight">NET 12-MONTH CHANGE</span><span className="font-mono text-2xl font-bold text-success tabular-nums">+$62,500</span></div>
            </div>
          </div>
        </>
      )

}