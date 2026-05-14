import React, { useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight, Lightbulb, CheckCircle2, AlertTriangle, Search, Clock, Check, RotateCcw, ChevronDown, CornerDownRight, TrendingUp, Plus, Minus, Equal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"

export default function UniversalLedgerDrawer() {
  const [searchQuery, setSearchQuery] = useState("")
  const isSearchEmpty = searchQuery.length > 0 && searchQuery !== "Gusto" && searchQuery !== "Acme" && searchQuery !== "Datadog"
  
  return (
        <>
          <SheetHeader className="px-6 pt-6 mb-6">
            <SheetTitle>UNIVERSAL LEDGER</SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-6 space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9 bg-muted/50" 
                  placeholder="Search vendor, amount, category..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Month: May 2026 <ChevronDown className="h-3 w-3 inline" /></Button>
                <Button variant="secondary" size="sm">Type: All Outflows <ChevronDown className="h-3 w-3 inline" /></Button>
                <Button variant="secondary" size="sm">Cat: All <ChevronDown className="h-3 w-3 inline" /></Button>
              </div>
            </div>
            {isSearchEmpty ? (
              <div className="py-8">
                <EmptyState
                  icon={Search}
                  title="No results found"
                  description={`No transactions found matching "${searchQuery}".`}
                  actionLabel="Clear Search"
                  onAction={() => setSearchQuery("")}
                  className="min-h-[200px]"
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </>
      )

}