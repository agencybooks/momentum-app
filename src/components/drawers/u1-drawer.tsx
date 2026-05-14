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

export default function U1Drawer() {
  return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>REVENUE CONCENTRATION</SheetTitle></SheetHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="text-destructive font-medium text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">Warning: Top client breaches 25% ceiling.</div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Concentration Ledger</h4>
              <div className="border rounded-md bg-card text-sm divide-y">
                <div className="flex justify-between p-3"><span className="font-medium">1. Acme Co.</span><span className="text-destructive font-mono font-medium tabular-nums">33.0%</span></div>
                <div className="flex justify-between p-3"><span className="font-medium">2. Brightline SaaS</span><span className="font-mono tabular-nums">21.0%</span></div>
                <div className="flex justify-between p-3"><span className="font-medium">3. Dunwoody Dental</span><span className="font-mono tabular-nums">11.0%</span></div>
              </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-destructive h-full w-[33%]"></div>
              <div className="bg-primary/60 h-full w-[21%]"></div>
              <div className="bg-primary/30 h-full w-[11%]"></div>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
              <h4 className="font-semibold text-primary mb-2 flex items-center"><ArrowUpRight className="h-4 w-4 mr-1" /> Mitigation Playbook</h4>
              <p className="text-sm text-muted-foreground mb-4">To dilute Acme Co. below 25%, you need to acquire $28.5K in new non-Acme revenue.</p>
              <Button className="w-full" variant="outline">View Growth Scenarios</Button>
            </div>
          </div>
        </>
      )

}