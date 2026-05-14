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

export default function SubsDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Software Subscriptions</SheetTitle>
            <SheetDescription>OpEx: $2,105/mo | 3.8% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-warning/10 text-warning p-4 rounded-md text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Subscription costs crept up 3.9% MoM. HubSpot annual renewal due next month ($4,800).</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subscription Audit</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "HubSpot CRM", amount: 800, renewal: "Jun 2026", dot: "bg-warning" },
                    { name: "Slack Business+", amount: 450, renewal: "Sep 2026", dot: "bg-success" },
                    { name: "Notion Team", amount: 320, renewal: "Aug 2026", dot: "bg-success" },
                    { name: "Zoom Business", amount: 300, renewal: "Jul 2026", dot: "bg-success" },
                    { name: "Others (3)", amount: 235, renewal: "Various", dot: "bg-muted-foreground" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", s.dot)} />
                        <span className="text-foreground">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${s.amount}</span>
                        <span className="text-xs text-muted-foreground">{s.renewal}</span>
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
                    { month: "Dec", amount: 1900 },
                    { month: "Jan", amount: 1950 },
                    { month: "Feb", amount: 1980 },
                    { month: "Mar", amount: 2000 },
                    { month: "Apr", amount: 2025 },
                    { month: "May", amount: 2105 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-warning/30" style={{ width: `${(m.amount / 2105) * 100}%` }} />
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