"use client"

import { useQueryState } from "nuqs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CashActionAlert } from "@/lib/db/types"
import type { LucideIcon } from "lucide-react"

const severityConfig: Record<CashActionAlert["severity"], {
  icon: LucideIcon
  iconColor: string
}> = {
  critical: {
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    iconColor: "text-brand-500",
  },
}

interface ActionAlertsCardProps {
  alerts: CashActionAlert[]
}

export function ActionAlertsCard({ alerts }: ActionAlertsCardProps) {
  const [, setDrawer] = useQueryState("drawer")

  return (
    <Card className="flex flex-col border-border bg-card h-full shadow-sm">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-medium text-foreground tracking-tight">Action Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="flex flex-col">
          {alerts.map((alert, index) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon
            const isLast = index === alerts.length - 1

            return (
              <div
                key={alert.id}
                onClick={() => setDrawer(alert.actionDrawerId)}
                className={cn(
                  "flex items-start gap-3 px-6 py-4 hover:bg-accent/50 transition-colors group cursor-pointer",
                  !isLast && "border-b border-border/40"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", config.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alert.headline}</p>
                  <p className="text-xs text-muted-foreground truncate">{alert.body}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
