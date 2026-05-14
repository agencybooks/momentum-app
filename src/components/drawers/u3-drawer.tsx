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

export default function U3Drawer() {
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

}