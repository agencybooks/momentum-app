"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"
import { Sparkles } from "lucide-react"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CopilotInsightCard, type InsightType } from "@/components/copilot-insight-card"

interface Insight {
  id: string
  type: InsightType
  title: string
  body: string
  deepDive?: boolean
  route?: string
}

const mockInsights: Insight[] = [
  {
    id: "concentration-risk",
    type: "danger",
    title: "Revenue Concentration Risk",
    body: "Acme Co represents 33% of total MRR. Breaches 25% ceiling.",
    deepDive: true,
    route: "/clients",
  },
  {
    id: "cash-squeeze",
    type: "warning",
    title: "Cash Flow Squeeze Approaching",
    body: "A $31,000 payroll run and a $12,000 AWS bill both hit on May 12th. Total cash will drop to $45k.",
    route: "/cash",
  },
  {
    id: "margin-compression",
    type: "insight",
    title: "Margin Compression Detected",
    body: "Blended gross margin dropped 1.2% over the last 30 days due to increased direct labor costs.",
    route: "/profitability",
  },
  {
    id: "collection-speed",
    type: "win",
    title: "Record Collection Speed",
    body: "DSO (Days Sales Outstanding) hit a 6-month low at 18 days. Cash cycle is highly efficient.",
  },
]

export function CopilotFeedDrawer() {
  const router = useRouter()
  const [, setDrawer] = useQueryState("drawer")
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set())

  const activeInsights = mockInsights.filter((i) => !clearedIds.has(i.id))
  const clearedInsights = mockInsights.filter((i) => clearedIds.has(i.id))

  const handleClear = (id: string) => {
    setClearedIds((prev) => new Set(prev).add(id))
  }

  const handleNavigate = (route: string) => {
    setDrawer(null)
    router.push(route)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-2 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <SheetHeader className="p-0">
            <SheetTitle>Copilot Insights</SheetTitle>
          </SheetHeader>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeInsights.length === 0 && clearedInsights.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-muted-foreground py-20">
            <Sparkles className="h-10 w-10 opacity-20" />
            <p className="text-sm">All clear. Copilot is monitoring your metrics.</p>
          </div>
        ) : (
          <>
            {activeInsights.length === 0 ? (
              <div className="flex flex-col items-center gap-3 text-muted-foreground py-12">
                <Sparkles className="h-10 w-10 opacity-20" />
                <p className="text-sm">All clear. Copilot is monitoring your metrics.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeInsights.map((insight) => (
                  <CopilotInsightCard
                    key={insight.id}
                    type={insight.type}
                    title={insight.title}
                    body={insight.body}
                    onDismiss={() => handleClear(insight.id)}
                    onDeepDive={insight.deepDive ? () => {} : undefined}
                    onClick={insight.route ? () => handleNavigate(insight.route!) : undefined}
                  />
                ))}
              </div>
            )}

            {clearedInsights.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <Accordion>
                  <AccordionItem value="cleared" className="border-none">
                    <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2">
                      View Cleared ({clearedInsights.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4 pt-2">
                        {clearedInsights.map((insight) => (
                          <CopilotInsightCard
                            key={insight.id}
                            type={insight.type}
                            title={insight.title}
                            body={insight.body}
                            cleared
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
