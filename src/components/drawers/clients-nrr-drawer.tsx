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

export default function ClientsNrrDrawer() {
  return (
        <>
          <SheetHeader className="pb-6 border-b border-border">
            <SheetTitle>Net Revenue Retention</SheetTitle>
            <SheetDescription>Tracks total MRR growth from existing clients, including expansion and contraction.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">NRR measures whether your existing client base is growing or shrinking in dollar terms. A value above 100% means expansion revenue is outpacing churn — you&apos;re growing even without new logos.</p>
            </div>
            <div className="text-sm font-mono tabular-nums text-muted-foreground">
              <p>Formula: (Current MRR from existing clients / Prior MRR) × 100</p>
            </div>
          </div>
        </>
      )

}