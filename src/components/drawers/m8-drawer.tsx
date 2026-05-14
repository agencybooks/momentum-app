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

export default function M8Drawer() {
  return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>FORWARD BOOKED REVENUE</SheetTitle><SheetDescription>Next 90 Days: $130.5K Confirmed</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-md text-sm flex items-start gap-3"><AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" /><div><strong className="block mb-1 font-sans">Thin Q3 Coverage</strong>Forward booked revenue only covers 62% of anticipated burn. You must close $45K in active pipeline by July to maintain cash.</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Pipeline Required to Break-Even</h4>
              <div className="border rounded-md bg-card text-sm divide-y"><div className="flex justify-between p-3 items-center"><div><span className="font-medium block">Drift Marketing</span><span className="text-muted-foreground text-xs">Expansion</span></div><div className="text-right"><span className="font-mono tabular-nums block font-medium text-success">+$5,000/mo</span><span className="text-muted-foreground font-medium text-xs">70% Prob</span></div></div><div className="flex justify-between p-3 items-center"><div><span className="font-medium block">Horizon Tech</span><span className="text-muted-foreground text-xs">New Logo</span></div><div className="text-right"><span className="font-mono tabular-nums block font-medium text-success">+$12,000/mo</span><span className="text-muted-foreground font-medium text-xs">50% Prob</span></div></div></div>
            </div>
          </div>
        </>
      )

}