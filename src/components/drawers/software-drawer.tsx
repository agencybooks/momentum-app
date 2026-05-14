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

export default function SoftwareDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Software / Tools</SheetTitle>
            <SheetDescription>COGS: $4,700/mo | 8.5% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Software costs up 14.1% MoM. Figma team upgrade and new analytics tooling drove the increase.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">License Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Figma Organization", amount: 1800, change: "+28%", color: "text-destructive", dot: "bg-destructive" },
                    { name: "Adobe Creative Cloud", amount: 1200, change: "—", color: "text-success", dot: "bg-success" },
                    { name: "Mixpanel", amount: 900, change: "New", color: "text-warning", dot: "bg-warning" },
                    { name: "GitHub Enterprise", amount: 800, change: "—", color: "text-success", dot: "bg-success" },
                  ].map((v) => (
                    <div key={v.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", v.dot)} />
                        <span className="text-foreground">{v.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${v.amount.toLocaleString()}</span>
                        <span className={cn("text-xs font-medium tabular-nums", v.color)}>{v.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">6-Month Trend</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { month: "Dec", amount: 3600 },
                    { month: "Jan", amount: 3700 },
                    { month: "Feb", amount: 3800 },
                    { month: "Mar", amount: 3900 },
                    { month: "Apr", amount: 4120 },
                    { month: "May", amount: 4700 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-destructive/30" style={{ width: `${(m.amount / 4700) * 100}%` }} />
                      </div>
                      <span className="font-mono tabular-nums text-foreground font-medium">${m.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )

}