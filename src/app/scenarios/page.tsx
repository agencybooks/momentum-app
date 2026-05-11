"use client"

import { Plus, ArrowUpRight, ShieldAlert, Rocket } from "lucide-react"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import SandboxTakeover from "@/components/scenarios/sandbox-takeover"
import { BaselineTrajectoryChart } from "@/components/scenarios/baseline-trajectory-chart"

export default function ScenariosPage() {
  const [sandbox, setSandbox] = useQueryState('sandbox')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Scenarios & Modeling</h1>
          <p className="text-muted-foreground mt-1">
            Simulate financial decisions and forecast runway impact.
          </p>
        </div>
        <Button onClick={() => setSandbox('active')}>
          <Plus className="h-4 w-4 mr-2" /> Blank Sandbox
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Baseline + Saved Sandboxes */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <BaselineTrajectoryChart />

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Saved Sandboxes</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Projected MRR</TableHead>
                    <TableHead className="text-right">Runway</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Aggressive Q3 Growth Plan</TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums text-success">+$15.9K/mo</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums">5.1 mo</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSandbox('active')}>
                          Open Sandbox <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Acme Co Churn Defense</TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums text-destructive">-$12.5K/mo</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums">4.2 mo</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSandbox('active')}>
                          Open Sandbox <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>

        {/* Right Column: Scenario Templates */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Start a New Scenario</h2>
          <Card className="p-6">
            <div className="flex items-center gap-2 font-semibold mb-4 text-destructive">
              <ShieldAlert className="w-5 h-5" /> DEFENSE (Survival)
            </div>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              Lose Biggest Client
            </Button>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              20% Revenue Drop
            </Button>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              Collections Slow by 15 Days
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 font-semibold mb-4 text-success">
              <Rocket className="w-5 h-5" /> OFFENSE (Growth)
            </div>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              Hire 2-3 People
            </Button>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              Raise Rates by 10%
            </Button>
            <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setSandbox('active')}>
              Land Massive Proposal
            </Button>
          </Card>
        </div>
      </div>

      {sandbox && <SandboxTakeover onClose={() => setSandbox(null)} />}
    </div>
  )
}
