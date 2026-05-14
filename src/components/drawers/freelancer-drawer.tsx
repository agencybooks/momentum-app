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

export default function FreelancerDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Freelancer Fees</SheetTitle>
            <SheetDescription>COGS: $15,500/mo | 28.2% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Freelancer costs held flat month-over-month. Utilization rate is healthy at 78%.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contractor Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Sarah K. — Design", amount: 6200, hours: 80, change: "—" },
                    { name: "Mike T. — Development", amount: 5800, hours: 72, change: "—" },
                    { name: "Anna R. — Copywriting", amount: 3500, hours: 45, change: "—" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <span className="text-foreground">{c.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{c.hours}h</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${c.amount.toLocaleString()}</span>
                        <span className="text-xs font-medium text-success">{c.change}</span>
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
                    { month: "Dec", amount: 14800 },
                    { month: "Jan", amount: 15200 },
                    { month: "Feb", amount: 15500 },
                    { month: "Mar", amount: 15500 },
                    { month: "Apr", amount: 15500 },
                    { month: "May", amount: 15500 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-muted-foreground/30" style={{ width: `${(m.amount / 15500) * 100}%` }} />
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