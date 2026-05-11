"use client"

import { useState, useEffect } from "react"
import { useQueryState } from "nuqs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Maximize2, Minimize2, AlertCircle, Mail, ArrowRight, ArrowUpRight, ArrowDownRight, Lightbulb, Shield, Zap, CheckCircle2, AlertTriangle, Search, Clock, Check, RotateCcw, ChevronDown, CornerDownRight, TrendingUp, Plus, Minus, Equal, Flame, UserMinus, Landmark, Divide } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ProfitabilityTrendDrawerContent, PROFITABILITY_TREND_DRAWER_IDS } from "./profitability-trend-drawers"

function DrawerContent({ drawer, setDrawer }: { drawer: string; setDrawer: (v: string | null) => void }) {
  switch (drawer) {
    case "m1":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              Cash Runway Forecast
            </SheetTitle>
            <SheetDescription className="mt-1">
              Current: 5.4 Months | Zero-Cash Date: Late Oct 2026
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                Runway tightened by 0.6 months due to a $15K increase in Q2 marketing spend and $25K delayed AR.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Mathematical Proof
              </h3>
              <div className="flex items-center justify-between w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Operating Cash</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$222.8K</span>
                </div>
                <Divide className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Avg Net Burn</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$41.2K/mo</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Runway</span>
                  <span className="text-sm font-medium tabular-nums text-amber-600 dark:text-amber-500">5.4 mos</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                Survival Playbook
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium"><Mail className="w-4 h-4 text-muted-foreground mr-2 inline" />Collect $25K Cobalt AR</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400">+0.6 mo</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium"><UserMinus className="w-4 h-4 text-muted-foreground mr-2 inline" />Pause planned Q3 hiring</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400">+1.2 mo</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium"><Landmark className="w-4 h-4 text-muted-foreground mr-2 inline" />Draw $50K on line of credit</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400">+1.2 mo</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )

    case "m2":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              Net Burn Waterfall
            </SheetTitle>
            <SheetDescription className="mt-1">
              Trailing 30 Days (April 2026)
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <Flame className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-destructive dark:text-red-400">
                Net Burn accelerated to -$15.2K this month. Driven by $25K miss in A/R.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Cash Flow Waterfall
              </h3>
              <div className="flex items-center justify-between w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Inflows</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600">$41.5K</span>
                </div>
                <Minus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Outflows</span>
                  <span className="text-sm font-medium tabular-nums text-destructive">$56.7K</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Net Burn</span>
                  <span className="text-sm font-medium tabular-nums text-destructive">-$15.2K</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-right mt-2">Starting Cash: $238.0K → Ending Cash: $222.8K</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                High-Level Movements
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Cash Inflows</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-500">+$41.5K</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Cash Outflows</span>
                  <span className="text-sm font-medium tabular-nums text-destructive">-$56.7K</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium ml-4 text-muted-foreground">Payroll</span>
                  <span className="text-sm tabular-nums text-muted-foreground">$31.0K</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium ml-4 text-muted-foreground">Operations</span>
                  <span className="text-sm tabular-nums text-muted-foreground">$25.7K</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )

    case "m3":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              Days Sales Outstanding
            </SheetTitle>
            <SheetDescription>
              Cash Conversion Efficiency
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Mathematical Proof
              </h3>
              <Card className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Open A/R</span>
                  <span className="font-mono font-medium tabular-nums">$112,000</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">&divide; Annual Rev</span>
                  <span className="font-mono font-medium tabular-nums">$1,000,000</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2 pt-1">
                  <span className="text-muted-foreground">&times; 365</span>
                  <span className="font-mono font-medium tabular-nums">365</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-medium">= DSO</span>
                  <span className="font-mono font-bold tabular-nums text-lg">41 Days</span>
                </div>
              </Card>
            </div>

            <div className="bg-destructive/10 text-destructive p-4 rounded-md my-4">
              DSO increased by 3 days. Cash conversion is slowing down.
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Action Playbook
              </h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start h-auto py-3 px-4">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span className="text-sm">Enforce Net-30 on Acme</span>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3 px-4">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="text-sm">Automate Follow-ups</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )

    case "m4":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              Revenue Movement
            </SheetTitle>
            <SheetDescription className="mt-1">
              This Month (May 2026) vs Last Month
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                Revenue grew by $3.5K (+9.2%). Entirely driven by expansion.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Revenue Bridge
              </h3>
              <div className="flex items-center justify-between w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">April Rev</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$38.0K</span>
                </div>
                <Plus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Gains</span>
                  <span className="text-sm font-medium tabular-nums text-emerald-600">+$3.5K</span>
                </div>
                <Minus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Losses</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$0</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">May Rev</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$41.5K</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                Deal Ledger
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-foreground">Acme Co.</span>
                    <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider bg-accent text-muted-foreground rounded-md">Scope Expansion</Badge>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm tabular-nums font-mono">+$2,500</span>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-foreground">Brightline SaaS</span>
                    <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider bg-accent text-muted-foreground rounded-md">Rate Hike</Badge>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm tabular-nums font-mono">+$1,000</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )

    case "m5":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight">
              Gross Margin Engine
            </SheetTitle>
            <SheetDescription className="mt-1">
              Current: 50.1% (Trailing 3 Months)
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col px-4 pb-6">
            <div className="w-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg flex items-start gap-3 p-3 mb-8">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                Margin improved by 1.8 points. Revenue expansion successfully outpaced fixed infrastructure costs.
              </span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Margin Calculation
              </h3>
              <div className="flex items-center justify-between w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$41.5K</span>
                </div>
                <Minus className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Total COGS</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$20.7K</span>
                </div>
                <Equal className="w-4 h-4 mt-5 text-muted-foreground/40 dark:text-muted-foreground/60 shrink-0" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Gross Profit</span>
                  <span className="text-sm font-medium tabular-nums text-foreground">$20.8K</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4">
                COGS Variance
              </h3>
              <div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">AWS Hosting</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$6,200</span>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20 shadow-none">+15%</Badge>
                  </div>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Stripe Fees</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$1,200</span>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-transparent hover:bg-amber-500/20 shadow-none">+4%</Badge>
                  </div>
                </div>
                <div className="group flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors -mx-2 px-2 rounded-md cursor-pointer">
                  <span className="text-sm font-medium">Labor</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">$13,308</span>
                    <Badge variant="secondary" className="bg-accent text-muted-foreground border-transparent shadow-none">—</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )

    case "m6":
      return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>CHURN & REVENUE MOVEMENT</SheetTitle><SheetDescription>Trailing 12 Months (Jun 2025 - May 2026)</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-8">
            <div className="bg-success/10 text-success border border-success/20 p-4 rounded-md text-sm flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-success" /><div><strong className="block mb-1 text-success">Quiet 12 Months</strong>0.9% average monthly churn, well under your 5% threshold. Only 1 client lost ($91K LTV impact).</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">The MRR Bridge</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <div className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">GAINS</div>
                  <div className="space-y-3 font-mono tabular-nums text-sm">
                    <div className="flex justify-between text-success"><span>+ New MRR</span><span>+$115.0K</span></div>
                    <div className="flex justify-between text-success border-b pb-3 border-border/50"><span>+ Expansion</span><span>+$74.5K</span></div>
                    <div className="flex justify-between pt-1 font-bold font-sans text-base"><span>Total</span><span className="text-success">+$189.5K</span></div>
                  </div>
                </div>
                <div className="border rounded-xl p-5">
                  <div className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">LOSSES</div>
                  <div className="space-y-3 font-mono tabular-nums text-sm">
                    <div className="flex justify-between text-destructive"><span>- Contraction</span><span>-$36.0K</span></div>
                    <div className="flex justify-between text-destructive border-b pb-3 border-border/50"><span>- Churned</span><span>-$91.0K</span></div>
                    <div className="flex justify-between pt-1 font-bold font-sans text-base"><span>Total</span><span className="text-destructive">-$127.0K</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-5 bg-muted/30 rounded-xl flex justify-between items-center border"><span className="font-semibold text-lg tracking-tight">NET 12-MONTH CHANGE</span><span className="font-mono text-2xl font-bold text-success tabular-nums">+$62,500</span></div>
            </div>
          </div>
        </>
      )

    case "m7":
      return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>SPEND CEILING CALCULATOR</SheetTitle><SheetDescription>Your Max CAC is $28.6K based on a 3:1 Target.</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-success/10 text-success-foreground border-success/20 border p-4 rounded-md text-sm flex items-start gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-success" /><div><strong className="block mb-1 text-success">CAC Headroom Available</strong>You are acquiring clients so efficiently ($13.2K CAC) that you can safely double your marketing spend without ruining your unit economics.</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">The Underlying Physics</h4>
              <div className="border rounded-md bg-card text-sm"><div className="flex justify-between p-3 border-b"><span className="font-sans text-muted-foreground">Current Lifetime Value (LTV)</span><span className="font-mono tabular-nums tracking-tight font-medium">$85,700</span></div><div className="flex justify-between p-3 border-b bg-muted/30"><span className="font-sans text-muted-foreground">Target LTV:CAC Ratio</span><span className="font-mono tabular-nums tracking-tight font-medium">3.0x</span></div><div className="flex justify-between p-3"><span className="font-sans text-muted-foreground font-medium">Mathematically Allowed CAC Ceiling</span><span className="font-mono tabular-nums tracking-tight font-bold text-primary">$28,600</span></div></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Capital Constraint Check</h4>
              <div className="border rounded-md bg-card text-sm mb-4"><div className="flex justify-between p-3 border-b"><span className="font-sans text-muted-foreground">Current CAC Payback Period</span><span className="font-mono tabular-nums tracking-tight font-medium">6.5 Months</span></div><div className="flex justify-between p-3"><span className="font-sans text-muted-foreground">Current Cash Runway</span><span className="font-mono tabular-nums tracking-tight font-medium text-destructive">5.4 Months</span></div></div>
              <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-md text-sm flex items-start gap-3"><AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" /><div><strong className="block mb-1 font-sans">Warning: Payback Exceeds Runway</strong>While your unit economics are excellent, your cash runway (5.4 mo) is shorter than your payback period (6.5 mo). You cannot afford to max out your spend ceiling right now without risking a cash crunch.</div></div>
            </div>
          </div>
        </>
      )

    case "m8":
      return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6"><SheetTitle>FORWARD BOOKED REVENUE</SheetTitle><SheetDescription>Next 90 Days: $130.5K Confirmed</SheetDescription></SheetHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-destructive/10 text-destructive border-destructive/20 border p-4 rounded-md text-sm flex items-start gap-3"><AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" /><div><strong className="block mb-1 font-sans">Thin Q3 Coverage</strong>Forward booked revenue only covers 62% of anticipated burn. You must close $45K in active pipeline by July to maintain cash.</div></div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Pipeline Required to Break-Even</h4>
              <div className="border rounded-md bg-card text-sm divide-y"><div className="flex justify-between p-3 items-center"><div><span className="font-medium block">Drift Marketing</span><span className="text-muted-foreground text-xs">Expansion</span></div><div className="text-right"><span className="font-mono tabular-nums block font-medium text-success">+$5,000/mo</span><span className="text-muted-foreground font-medium text-xs">70% Prob</span></div></div><div className="flex justify-between p-3 items-center"><div><span className="font-medium block">Horizon Tech</span><span className="text-muted-foreground text-xs">New Logo</span></div><div className="text-right"><span className="font-mono tabular-nums block font-medium text-success">+$12,000/mo</span><span className="text-muted-foreground font-medium text-xs">50% Prob</span></div></div></div>
            </div>
          </div>
        </>
      )

    case "m9":
      return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6">
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              Current Cash Position
            </SheetTitle>
            <SheetDescription>
              $125,000 as of May 2026 | Target: $200,000
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-md text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1 font-sans">Below Operating Target</strong>
                Current cash is $75K below the $200K target. At current burn rate ($15.2K/mo net), you have 5.4 months of runway remaining.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Cash Position Breakdown</h4>
              <div className="flex items-center justify-between w-full bg-accent/30 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Cash On Hand</span>
                  <span className="text-sm font-medium tabular-nums text-foreground font-mono">$125,000</span>
                </div>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Payables (14d)</span>
                  <span className="text-sm font-medium tabular-nums text-destructive font-mono">$42,500</span>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Expected A/R</span>
                  <span className="text-sm font-medium tabular-nums text-success font-mono">$29,300</span>
                </div>
                <Equal className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground">Net Position</span>
                  <span className="text-sm font-medium tabular-nums text-foreground font-mono">$111,800</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Account Summary</h4>
              <div className="border rounded-md bg-card text-sm divide-y">
                <div className="flex justify-between p-3 items-center">
                  <div>
                    <span className="font-medium block">Operating Account</span>
                    <span className="text-muted-foreground text-xs">Chase Business Checking</span>
                  </div>
                  <span className="font-mono tabular-nums font-medium">$105,000</span>
                </div>
                <div className="flex justify-between p-3 items-center">
                  <div>
                    <span className="font-medium block">Reserve Account</span>
                    <span className="text-muted-foreground text-xs">Chase Business Savings</span>
                  </div>
                  <span className="font-mono tabular-nums font-medium">$20,000</span>
                </div>
                <div className="flex justify-between p-3 items-center">
                  <div>
                    <span className="font-medium block">Available Credit Line</span>
                    <span className="text-muted-foreground text-xs">Chase Business LOC — Untapped</span>
                  </div>
                  <span className="font-mono tabular-nums font-medium text-muted-foreground">$50,000</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setDrawer("universal-ledger")}>
              View Full Transaction Ledger
            </Button>
          </div>
        </>
      )

    case "u5":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              LEVER 1: ACQUISITION
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 text-sm">Need 100 Raw Leads based on 10% meeting conversion and 20% close rate.</div>
        </>
      )

    case "u6":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              LEVER 2: EXPANSION
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 text-sm">Acme Co (Prime for scope expansion)</div>
        </>
      )

    case "u7":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              LEVER 3: DEAL SIZE
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 text-sm">Establish a strict 5% discount floor.</div>
        </>
      )

    case "u8":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              LEVER 4: RETENTION
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 text-sm">Cobalt Outdoor ($8.3K MRR, 75 days overdue)</div>
        </>
      )

    case "u9":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              SAVE SCENARIO
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 text-sm">Scenario Name: Aggressive Q3 Growth</div>
        </>
      )

    case "u4":
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
                      <div className="h-2 w-2 rounded-full shrink-0 bg-amber-500" />
                      <span className="text-foreground">Vercel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$1,845</span>
                      <span className="text-xs font-medium text-amber-500 tabular-nums">+8%</span>
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

    case "u1":
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

    case "u2":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase inline-flex items-center gap-3">
              Cobalt Outdoor
              <Badge variant="destructive">At Risk</Badge>
            </SheetTitle>
            <SheetDescription>
              Accounts Receivable Intelligence
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="flex gap-3">
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">MRR</div>
                <div className="font-mono font-bold tabular-nums">$4,200</div>
              </Card>
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Margin</div>
                <div className="font-mono font-bold tabular-nums">41%</div>
              </Card>
              <Card className="flex-1 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Tenure</div>
                <div className="font-mono font-bold tabular-nums">8m</div>
              </Card>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Active Exposure
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Invoice</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">INV-2001</TableCell>
                    <TableCell className="text-destructive">75 days late</TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-medium">$25,000</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="font-medium">INV-2002</TableCell>
                    <TableCell className="text-muted-foreground">Open</TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-medium">$4,200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Button className="w-full mt-6">Send Escalation Email</Button>
          </div>
        </>
      )

    case "u3":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              HubSpot Annual
            </SheetTitle>
            <SheetDescription>
              Accounts Payable Control
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <Card className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due</span>
                <span className="font-medium">May 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono font-bold tabular-nums">$7,300</span>
              </div>
            </Card>

            <div className="bg-muted p-4 rounded-md my-4">
              Delaying this payment 30 days yields +0.2 months of runway.
            </div>

            <Button variant="outline" className="w-full">Draft Deferral Request</Button>
          </div>
        </>
      )

    case "m10":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">
              Operating Margin Analysis
            </SheetTitle>
            <SheetDescription>
              Current: 19.0% | Target: &gt;20%
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Operating margin dropped 2.1pp. OpEx is growing faster than revenue -- Marketing spend surged 23.9% while revenue grew only 9.2%.</span>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Mathematical Proof
              </h3>
              <Card className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Profit</span>
                  <span className="font-mono font-medium tabular-nums">$27,555</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Operating Expenses</span>
                  <span className="font-mono font-medium tabular-nums text-destructive">-$17,105</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2 pt-1">
                  <span className="font-medium">= Operating Profit</span>
                  <span className="font-mono font-bold tabular-nums">$10,450</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">&divide; Revenue ($55,000)</span>
                  <span className="font-mono font-bold tabular-nums text-lg">19.0%</span>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                OpEx Breakdown
              </h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-destructive" />
                      <span className="text-foreground">Marketing & Ads</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$1,000</span>
                      <span className="text-xs font-medium text-destructive tabular-nums">+23.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-amber-500" />
                      <span className="text-foreground">Software Subscriptions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$2,105</span>
                      <span className="text-xs font-medium text-amber-500 tabular-nums">+3.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0 bg-success" />
                      <span className="text-foreground">Core Payroll</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">$14,000</span>
                      <span className="text-xs font-medium text-muted-foreground">—</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )

    case 'universal-ledger':
      return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6">
            <SheetTitle>UNIVERSAL LEDGER</SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-6 space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 bg-muted/50" placeholder="Search vendor, amount, category..." />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Month: May 2026 <ChevronDown className="h-3 w-3 inline" /></Button>
                <Button variant="secondary" size="sm">Type: All Outflows <ChevronDown className="h-3 w-3 inline" /></Button>
                <Button variant="secondary" size="sm">Cat: All <ChevronDown className="h-3 w-3 inline" /></Button>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Anomalies Detected This Period</h4>
              <div className="border border-destructive/20 bg-destructive/5 rounded-md text-sm divide-y divide-destructive/10">
                <div className="flex justify-between items-center p-3">
                  <div>
                    <span className="font-medium block text-destructive">AWS (Amazon Web Services)</span>
                    <span className="text-muted-foreground text-xs">May 04</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-medium block text-destructive">-$4,200</span>
                    <span className="text-destructive font-medium tabular-nums text-xs">+40% vs Avg</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">May 2026</h4>
              <div className="border rounded-md bg-card text-sm divide-y">
                <div className="flex justify-between items-center p-3">
                  <div>
                    <span className="font-medium flex items-center gap-2"><ArrowDownRight className="h-4 w-4 text-destructive" /> Gusto Payroll</span>
                    <span className="text-muted-foreground text-xs ml-6"><CornerDownRight className="h-3 w-3 inline mr-1" />Includes $2K Q2 bonuses</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-medium block">-$18,500</span>
                    <span className="text-muted-foreground text-xs">[ R&D Labor ]</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <div>
                    <span className="font-medium flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-success" /> Acme Co. (Invoice #1042)</span>
                    <span className="text-muted-foreground text-xs ml-6">May 10</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-medium block text-success">+$12,400</span>
                    <span className="text-muted-foreground text-xs">[ Revenue ]</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <div>
                    <span className="font-medium flex items-center gap-2"><ArrowDownRight className="h-4 w-4 text-destructive" /> Datadog Inc</span>
                    <span className="text-muted-foreground text-xs ml-6">May 08</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-medium block">-$1,200</span>
                    <span className="text-muted-foreground text-xs">[ COGS Tech ]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )

    case "retainers":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Client Retainers</SheetTitle>
            <SheetDescription>Revenue stream: $45,000/mo | 81.8% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Retainer revenue grew 2.1% month-over-month. Concentration risk remains elevated at 33% (Acme Co).</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Client Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Acme Co", amount: 15000, change: "+5%", color: "text-destructive" },
                    { name: "Sterling & Partners", amount: 8500, change: "+2%", color: "text-success" },
                    { name: "Cobalt Outdoor", amount: 7200, change: "—", color: "text-success" },
                    { name: "Apex Digital", amount: 6800, change: "+3%", color: "text-success" },
                    { name: "Others (6)", amount: 7500, change: "-1%", color: "text-amber-500" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-foreground">{c.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${c.amount.toLocaleString()}</span>
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
                    { month: "Dec", amount: 41000 },
                    { month: "Jan", amount: 42200 },
                    { month: "Feb", amount: 42800 },
                    { month: "Mar", amount: 43500 },
                    { month: "Apr", amount: 44100 },
                    { month: "May", amount: 45000 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-brand-500/30" style={{ width: `${(m.amount / 45000) * 100}%` }} />
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

    case "projects":
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
                        <Badge variant="outline" className="ml-2 text-[10px]">{p.status}</Badge>
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
                        <Badge variant="secondary" className="text-[10px]">{p.probability}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )

    case "freelancer":
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

    case "hosting":
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
                    { name: "Vercel Pro", amount: 1845, change: "+8%", color: "text-amber-500", dot: "bg-amber-500" },
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
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">Optimize Spend</Button>
            </div>
          </div>
        </>
      )

    case "software":
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
                    { name: "Mixpanel", amount: 900, change: "New", color: "text-amber-500", dot: "bg-amber-500" },
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

    case "payroll":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Core Payroll</SheetTitle>
            <SheetDescription>OpEx: $14,000/mo | 25.5% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Payroll held flat at $14,000. Team of 3 FTEs at target cost-per-head of $4,667/mo.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Headcount Breakdown</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { role: "Founder / Strategy", cost: 5500, type: "FTE" },
                    { role: "Account Manager", cost: 4800, type: "FTE" },
                    { role: "Operations Lead", cost: 3700, type: "FTE" },
                  ].map((h) => (
                    <div key={h.role} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{h.role}</span>
                        <Badge variant="secondary" className="text-[10px]">{h.type}</Badge>
                      </div>
                      <span className="font-mono tabular-nums">${h.cost.toLocaleString()}</span>
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
                    { month: "Dec", amount: 14000 },
                    { month: "Jan", amount: 14000 },
                    { month: "Feb", amount: 14000 },
                    { month: "Mar", amount: 14000 },
                    { month: "Apr", amount: 14000 },
                    { month: "May", amount: 14000 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-muted-foreground/30" style={{ width: "100%" }} />
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

    case "subs":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Software Subscriptions</SheetTitle>
            <SheetDescription>OpEx: $2,105/mo | 3.8% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-4 rounded-md text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Subscription costs crept up 3.9% MoM. HubSpot annual renewal due next month ($4,800).</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subscription Audit</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "HubSpot CRM", amount: 800, renewal: "Jun 2026", dot: "bg-amber-500" },
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
                        <div className="h-2 rounded-full bg-amber-500/30" style={{ width: `${(m.amount / 2105) * 100}%` }} />
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

    case "marketing":
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
                    { name: "Content / SEO", amount: 200, change: "+10%", color: "text-amber-500", dot: "bg-amber-500" },
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

    case "interest":
      return (
        <>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold tracking-tight uppercase">Interest & Fees</SheetTitle>
            <SheetDescription>Other Expenses: $1,430/mo | 2.6% of revenue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="bg-success/10 text-success p-4 rounded-md text-sm flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Interest and fees held flat. Line of credit at 7.2% APR with $18K remaining balance.</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Debt Service</h3>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { name: "Line of Credit Interest", amount: 1080, rate: "7.2% APR" },
                    { name: "Bank Fees (Mercury)", amount: 200, rate: "Fixed" },
                    { name: "Payment Processing", amount: 150, rate: "2.9% + 30¢" },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-foreground">{d.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">${d.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{d.rate}</span>
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
                    { month: "Dec", amount: 1430 },
                    { month: "Jan", amount: 1430 },
                    { month: "Feb", amount: 1430 },
                    { month: "Mar", amount: 1430 },
                    { month: "Apr", amount: 1430 },
                    { month: "May", amount: 1430 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground w-12">{m.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full bg-muted-foreground/30" style={{ width: "100%" }} />
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

    case "gross-margin-trend":
    case "op-margin-trend":
    case "net-margin-trend":
    case "revenue-trend":
    case "cogs-trend":
    case "gross-profit-trend":
      return <ProfitabilityTrendDrawerContent drawerId={drawer} />

    default:
      return null
  }
}

export function GlobalDrawers() {
  const [drawer, setDrawer] = useQueryState("drawer")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDrawer('universal-ledger');
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setDrawer]);

  const globalDrawerIds = ["test", "ar-intelligence", "action-center", "client-ledger", "action-insight"]
  const isHandledByGlobalDrawer = globalDrawerIds.includes(drawer ?? "")

  return (
    <Sheet open={!!drawer && !isHandledByGlobalDrawer} onOpenChange={(open) => { if (!open) { setDrawer(null); setIsFullscreen(false) } }}>
      <SheetContent
        className={cn(
          "overflow-y-auto",
          isFullscreen
            ? "!left-0 !right-0 !mx-auto !w-[calc(100vw-32px)] !max-w-7xl transition-all duration-300 ease-in-out"
            : "w-[95vw] sm:w-[var(--drawer-width-master)]"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-12 top-3 z-10"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          {drawer && <DrawerContent drawer={drawer} setDrawer={setDrawer} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
