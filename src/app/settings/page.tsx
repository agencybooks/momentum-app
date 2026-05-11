"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { AlertTriangle, Database, Shield, CheckCircle2, LayoutTemplate, Target, LogOut } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your data integrations, chart of accounts, and financial targets.
        </p>
      </div>

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="workspace" className="flex gap-2">
            <Database className="h-4 w-4" /> Workspace &amp; Data
          </TabsTrigger>
          <TabsTrigger value="coa" className="flex gap-2">
            <LayoutTemplate className="h-4 w-4" /> COA Mapping
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex gap-2">
            <Target className="h-4 w-4" /> Goals &amp; Targets
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Workspace & Data */}
        <TabsContent value="workspace">
          <div className="space-y-6">
            <div className="bg-amber-500/10 text-amber-700 dark:text-amber-500 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">QuickBooks Sync is Delayed</strong>
                Your data syncs daily, but the last successful sync was 8 days ago. Your dashboard
                data may be stale.
                <div className="mt-2 text-sm font-medium cursor-pointer hover:underline inline-flex items-center text-foreground">
                  Notify Admin Support
                </div>
              </div>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">QuickBooks Online</span>
                </div>
                <span className="flex items-center text-amber-600 dark:text-amber-500 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Stale (Last Sync: Apr
                  30, 2026)
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Workspace: Northwind Marketing | Cadence: Daily
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" /> Connection securely managed by your Momentum Admin
                team.
              </div>
            </Card>
          </div>

          <h3 className="font-semibold mt-10 mb-4">User Profile &amp; Security</h3>
          <Card className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-full font-bold">
                DA
              </div>
              <div>
                <div className="font-semibold">David Aleckson</div>
                <div className="text-sm text-muted-foreground">david@agencybooks.io</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2 text-right">
                Sign-In Method: Magic Link
              </div>
              <div className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: COA Mapping */}
        <TabsContent value="coa">
          <div className="flex gap-4 mb-6">
            <Card className="p-4 flex-1 border-success/30 bg-success/5">
              <div className="text-success font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> 12 / 14 MAPPED ACCOUNTS
              </div>
            </Card>
            <Card className="p-4 flex-1 border-destructive/30 bg-destructive/5">
              <div className="text-destructive font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> 2 UNMAPPED ACCOUNTS
              </div>
              <div className="text-sm text-destructive mt-1">
                Action Required. $6.2K Floating.
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden p-0 mt-6">
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>QBO Account</TableHead>
                    <TableHead className="text-right">YTD Total</TableHead>
                    <TableHead>Momentum Group</TableHead>
                    <TableHead>Sub-Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#4000 Subscription Rev</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $310.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="revenue">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="saas">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#4100 Services Rev</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $85.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="revenue">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="onetime">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#5000 Prod. Salaries</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $130.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="direct">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="labor">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#5050 Contractors</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $50.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="direct">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="labor">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#6000 Sales Comm.</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $20.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="marketing">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="comp">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#6100 Google Ads</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $42.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="marketing">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="media">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#7000 Owner Comp</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $60.0K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="admin">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="comp">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#7200 Software Tools</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $14.5K
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="admin">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue="tech">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="onetime">One-Time</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="comp">Comp</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-destructive">
                      #6050 Uncategorized Exp
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      $6.2K
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[180px] h-8 text-xs border-destructive text-destructive">
                          <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="direct">Direct Costs</SelectItem>
                          <SelectItem value="marketing">Marketing/Sales</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select disabled>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Select Sub-Category" />
                        </SelectTrigger>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: Goals & Targets */}
        <TabsContent value="goals">
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" /> SURVIVAL &amp; CASH GOALS
            </h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center py-4">
                <div className="w-1/3">
                  <div className="font-medium">Cash Runway</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual: <span className="font-mono tabular-nums text-destructive">5.4 mo</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Floor</span>
                  <div className="relative">
                    <Input
                      defaultValue="6.0"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      mo
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t">
                <div className="w-1/3">
                  <div className="font-medium">DSO (Days Sales Out)</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-destructive">41 days</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Ceiling</span>
                  <div className="relative">
                    <Input
                      defaultValue="45"
                      className="w-24 pl-3 pr-10 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      days
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t">
                <div className="w-1/3">
                  <div className="font-medium">Top Client Conc.</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-destructive">33.0%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Ceiling</span>
                  <div className="relative">
                    <Input
                      defaultValue="25"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 mt-2">
              <Target className="h-4 w-4 text-muted-foreground" /> PROFITABILITY MARGINS
            </h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center py-4">
                <div className="w-1/3">
                  <div className="font-medium">Gross Margin</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-success">50.1%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Floor</span>
                  <div className="relative">
                    <Input
                      defaultValue="50.0"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t">
                <div className="w-1/3">
                  <div className="font-medium">Net Margin</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-destructive">19.0%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Floor</span>
                  <div className="relative">
                    <Input
                      defaultValue="20.0"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-8">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" /> CAPITAL EFFICIENCY
            </h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center py-4">
                <div className="w-1/3">
                  <div className="font-medium">Labor Efficiency Ratio (LER)</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-success">2.10x</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Floor</span>
                  <div className="relative">
                    <Input
                      defaultValue="2.00"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      x
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t">
                <div className="w-1/3">
                  <div className="font-medium">Net Revenue Retention (NRR)</div>
                  <div className="text-sm text-muted-foreground">
                    Current Actual:{" "}
                    <span className="font-mono tabular-nums text-success">105.1%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Floor</span>
                  <div className="relative">
                    <Input
                      defaultValue="100.0"
                      className="w-24 pl-3 pr-8 font-mono tabular-nums text-right"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-8">
            <Button>Save Configuration</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
