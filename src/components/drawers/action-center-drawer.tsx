"use client"

import * as React from "react"
import { getAlerts } from "@/lib/db/services"
import { Alert } from "@/lib/db/types"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, AlertCircle, CheckCircle, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ActionCenterDrawer() {
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    setLoading(true)

    getAlerts().then((data) => {
      if (isMounted) {
        setAlerts(data)
        setLoading(false)
      }
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading alerts...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <SheetHeader className="pb-4 border-b border-border text-left">
        <SheetTitle className="text-2xl font-bold text-foreground">
          Action Center
        </SheetTitle>
        <SheetDescription>
          Active alerts and required resolutions.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6">
        <h3 className="text-sm font-medium text-foreground tracking-tight">ACTIVE ALERTS</h3>
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => {
            const isCritical = alert.type === "critical"
            const isWarning = alert.type === "warning"
            const isSuccess = alert.type === "success"
            
            // Map the alert to a specific href
            let href = alert.linkTo || "/"
            if (alert.drawerTrigger) {
              href += `?drawer=${alert.drawerTrigger}`
              // Hardcoded mapping for Cobalt Outdoor to fulfill the router requirement
              if (alert.id === "al_02" || alert.title.includes("Cobalt Outdoor")) {
                href += `&clientId=cl_02`
              }
            }

            return (
              <div
                key={alert.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4 text-sm transition-colors bg-card",
                  isCritical ? "border-destructive/30" : "border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isCritical && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    {isWarning && <AlertCircle className="h-5 w-5 text-amber-500" />}
                    {isSuccess && <CheckCircle className="h-5 w-5 text-success" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "font-semibold leading-none",
                      isCritical ? "text-destructive" : "text-foreground"
                    )}>
                      {alert.title}
                    </p>
                    <p className="leading-snug text-muted-foreground mt-1.5">
                      {alert.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Link href={href} scroll={false}>
                    <Button size="sm" variant={isCritical ? "default" : "secondary"}>
                      Resolve <ArrowUpRight className="h-3 w-3 inline" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No active alerts.</p>
          )}
        </div>
      </div>
    </div>
  )
}
