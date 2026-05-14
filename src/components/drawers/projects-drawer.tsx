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

export default function ProjectsDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">One-off Projects</SheetTitle>
            <SheetDescription>Revenue stream: $10,000/mo | 18.2% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Project revenue held flat. Pipeline shows 3 proposals ($18K total) pending close this quarter.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Projects</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Cobalt — Brand Refresh", amount: 4500, status: "In Progress" },
                    { name: "Sterling — Q3 Campaign", amount: 3200, status: "In Progress" },
                    { name: "Apex — Landing Pages", amount: 2300, status: "Delivered" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <span className="text-foreground">{p.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{p.status}</Badge>
                      </div>
                      <span className="font-mono tabular-nums">${p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pipeline</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Acme — SEO Audit", amount: 8000, probability: "70%" },
                    { name: "NewCo — MVP Build", amount: 6500, probability: "40%" },
                    { name: "Sterling — Video Series", amount: 3500, probability: "85%" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-foreground">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${p.amount.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-xs">{p.probability}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )

}