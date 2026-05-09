"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CoPilotAlert } from "@/components/co-pilot-alert"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export default function SettingsPage() {
  return (
    <div className="p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace, chart of accounts, and financial targets.
        </p>
      </div>

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="workspace">Workspace & Data</TabsTrigger>
          <TabsTrigger value="coa">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
        </TabsList>

        {/* TAB 1: Workspace & Data */}
        <TabsContent value="workspace" className="space-y-6">
          <CoPilotAlert
            id="sync-warning"
            type="warning"
            title="Quickbooks Sync is Delayed"
            message="Your QuickBooks connection hasn't synced in 48 hours. Please reconnect to ensure accurate data."
            isRead={false}
          />
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Admin Profile</h3>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <div className="mt-1 font-medium">Momentum Admin</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="mt-1 font-medium">admin@momentum.com</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1 font-medium">Owner</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: Chart of Accounts Mapping */}
        <TabsContent value="coa" className="space-y-6">
          <CoPilotAlert
            id="coa-critical"
            type="critical"
            title="🚨 2 UNMAPPED ACCOUNTS (Action Required)"
            message="We detected new accounts in your general ledger. Map them below to fix your Scorecard reporting."
            isRead={false}
          />

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QBO Account</TableHead>
                  <TableHead>Momentum Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#5000 Prod. Salaries</TableCell>
                  <TableCell>Cost of Delivery (COGS)</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-success/10 text-success border-success/20">
                      Mapped
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#5010 Software Subs</TableCell>
                  <TableCell>Operating Expenses (OPEX)</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-success/10 text-success border-success/20">
                      Mapped
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-destructive/5">
                  <TableCell className="font-medium text-destructive">#6025 New Marketing Ad Spend</TableCell>
                  <TableCell className="text-muted-foreground italic">Unassigned</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20">
                      Action Required
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-destructive/5">
                  <TableCell className="font-medium text-destructive">#6030 Legal Fees Retainer</TableCell>
                  <TableCell className="text-muted-foreground italic">Unassigned</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20">
                      Action Required
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: Goals & Targets */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Survival Goals</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="font-medium">Cash Runway Floor</span>
                  <span className="font-bold text-lg tabular-nums">6.0 mo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Triggers critical alerts if projected runway dips below this threshold.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Profitability Goals</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="font-medium">Net Margin Floor</span>
                  <span className="font-bold text-lg tabular-nums">20.0%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The baseline profitability target for calculating scorecard variances.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
