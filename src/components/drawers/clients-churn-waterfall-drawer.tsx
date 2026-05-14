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

export default function ClientsChurnWaterfallDrawer() {
  return (
        <>
          <SheetHeader className="pb-6 border-b border-border">
            <SheetTitle>Churn Impact Detail</SheetTitle>
            <SheetDescription>Trailing 90-day breakdown of MRR gains and losses by client.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">This view isolates the specific dollar movements in your client base over the past 3 months — which clients expanded, which contracted, and what the net effect was on total MRR.</p>
            </div>
          </div>
        </>
      )

}