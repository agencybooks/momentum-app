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

export default function U4Drawer() {
  return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              Category Deep Dive
            </SheetTitle>
            <SheetDescription>
              Hosting & Infrastructure (COGS)
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Growing faster than revenue (+15.0% vs +9.2%). Now 13.2% of total revenue.</span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                6-Month Trend
              </h3>
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
                        <div
                          className="h-2 rounded-full bg-destructive/30"
                          style={{ width: `${(m.amount / 7245) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-foreground font-medium">
                        ${m.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Vendor Breakdown
              </h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-destructive" />
                      <span className="text-foreground">AWS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$4,200</span>
                      <span className="text-xs font-medium text-destructive tabular-nums">+40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-warning" />
                      <span className="text-foreground">Vercel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$1,845</span>
                      <span className="text-xs font-medium text-warning tabular-nums">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
                      <span className="text-foreground">Datadog</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$1,200</span>
                      <span className="text-xs font-medium text-muted-foreground">—</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )

}