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

export default function M7Drawer() {
  return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>SPEND CEILING CALCULATOR</SheetTitle><SheetDescription>Your Max CAC is $28.6K based on a 3:1 Target.</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-success/10 text-success-foreground border-success/20 border p-4 rounded-md text-sm flex items-start gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-success" /><div><strong className="block mb-1 text-success">CAC Headroom Available</strong>You are acquiring clients so efficiently ($13.2K CAC) that you can safely double your marketing spend without ruining your unit economics.</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">The Underlying Physics</h4>
              <div className="border rounded-md bg-card text-sm"><div className="flex justify-between p-3 border-b"><span className="font-sans text-muted-foreground">Current Lifetime Value (LTV)</span><span className="font-mono tabular-nums tracking-tight font-medium">$85,700</span></div><div className="flex justify-between p-3 border-b bg-muted/30"><span className="font-sans text-muted-foreground">Target LTV:CAC Ratio</span><span className="font-mono tabular-nums tracking-tight font-medium">3.0x</span></div><div className="flex justify-between p-3"><span className="font-sans text-muted-foreground font-medium">Mathematically Allowed CAC Ceiling</span><span className="font-mono tabular-nums tracking-tight font-bold text-primary">$28,600</span></div></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Capital Constraint Check</h4>
              <div className="border rounded-md bg-card text-sm mb-4"><div className="flex justify-between p-3 border-b"><span className="font-sans text-muted-foreground">Current CAC Payback Period</span><span className="font-mono tabular-nums tracking-tight font-medium">6.5 Months</span></div><div className="flex justify-between p-3"><span className="font-sans text-muted-foreground">Current Cash Runway</span><span className="font-mono tabular-nums tracking-tight font-medium text-destructive">5.4 Months</span></div></div>
              <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-md text-sm flex items-start gap-3"><AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" /><div><strong className="block mb-1 font-sans">Warning: Payback Exceeds Runway</strong>While your unit economics are excellent, your cash runway (5.4 mo) is shorter than your payback period (6.5 mo). You cannot afford to max out your spend ceiling right now without risking a cash crunch.</div></div>
            </div>
          </div>
        </>
      )

}