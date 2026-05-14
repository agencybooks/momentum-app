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

export default function MarketingDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Marketing & Ads</SheetTitle>
            <SheetDescription>OpEx: $1,000/mo | 1.8% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Marketing spend surged 23.9% MoM. LinkedIn Ads campaign launched mid-April drove the spike. CAC impact: $320 → $410.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Channel Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "LinkedIn Ads", amount: 480, change: "+60%", color: "text-destructive", dot: "bg-destructive" },
                    { name: "Google Ads", amount: 320, change: "—", color: "text-success", dot: "bg-success" },
                    { name: "Content / SEO", amount: 200, change: "+10%", color: "text-warning", dot: "bg-warning" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", c.dot)} />
                        <span className="text-foreground">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${c.amount}</span>
                        <span className={cn("text-xs font-medium tabular-nums", c.color)}>{c.change}</span>
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
                    { month: "Dec", amount: 600 },
                    { month: "Jan", amount: 650 },
                    { month: "Feb", amount: 700 },
                    { month: "Mar", amount: 750 },
                    { month: "Apr", amount: 807 },
                    { month: "May", amount: 1000 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-destructive/30" style={{ width: `${(m.amount / 1000) * 100}%` }} />
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