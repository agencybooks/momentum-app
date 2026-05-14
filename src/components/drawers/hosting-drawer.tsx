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

export default function HostingDrawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Hosting & Infrastructure</SheetTitle>
            <SheetDescription>COGS: $7,245/mo | 13.2% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Growing faster than revenue (+15.0% vs +9.2%). AWS us-east-1 costs spiked 40% due to unoptimized Lambda invocations.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">6-Month Trend</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { month: "Dec", amount: 5400 },
                    { month: "Jan", amount: 5600 },
                    { month: "Feb", amount: 5900 },
                    { month: "Mar", amount: 6100 },
                    { month: "Apr", amount: 6300 },
                    { month: "May", amount: 7245 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-destructive/30" style={{ width: `${(m.amount / 7245) * 100}%` }} />
                      </div>
                      <span className="font-mono tabular-nums text-foreground font-medium">${m.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Vendor Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "AWS (us-east-1)", amount: 4200, change: "+40%", color: "text-destructive", dot: "bg-destructive" },
                    { name: "Vercel Pro", amount: 1845, change: "+8%", color: "text-warning", dot: "bg-warning" },
                    { name: "Cloudflare R2", amount: 1200, change: "—", color: "text-success", dot: "bg-success" },
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
            <div className="pt-2">
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-primary-foreground">Optimize Spend</Button>
            </div>
          </div>
        </>
      )

}