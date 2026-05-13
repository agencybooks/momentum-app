"use client"

import { useEffect, useState } from "react"
import { Database, Clock, CreditCard, Users, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Integration } from "@/lib/db/types"

const iconMap: Record<string, LucideIcon> = {
  Database,
  Clock,
  CreditCard,
  Users,
}

const statusConfig: Record<
  Integration["status"],
  { className: string; label: string }
> = {
  connected: {
    className: "bg-success/10 text-success border-success/20",
    label: "Connected",
  },
  syncing: {
    className: "bg-success/10 text-success border-success/20",
    label: "Syncing",
  },
  delayed: {
    className: "bg-warning/10 text-warning border-warning/20",
    label: "Delayed",
  },
  disconnected: {
    className: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Disconnected",
  },
}

interface DataSyncTabProps {
  integrations: Integration[]
  onScoreChange: (score: number) => void
}

function computeScore(items: Integration[]): number {
  return items
    .filter((i) => i.status !== "disconnected")
    .reduce((sum, i) => sum + i.scoreWeight, 0)
}

export function DataSyncTab({ integrations, onScoreChange }: DataSyncTabProps) {
  const [items, setItems] = useState<Integration[]>(integrations)

  useEffect(() => {
    onScoreChange(computeScore(items))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleReconnect(id: string) {
    const updated = items.map((i) =>
      i.id === id ? { ...i, status: "connected" as const, lastSync: "Just now" } : i
    )
    setItems(updated)
    onScoreChange(computeScore(updated))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((integration) => {
        const Icon = iconMap[integration.iconName]
        const status = statusConfig[integration.status]

        return (
          <Card key={integration.id}>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                  <span className="font-semibold">{integration.name}</span>
                </div>
                <Badge
                  className={cn("border", status.className)}
                >
                  {status.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {integration.lastSync
                  ? `Last sync: ${integration.lastSync}`
                  : "Never synced"}
              </p>

              {integration.status === "disconnected" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReconnect(integration.id)}
                >
                  Reconnect
                </Button>
              ) : integration.status === "delayed" ? (
                <Button variant="outline" size="sm">
                  Check Status
                </Button>
              ) : (
                <Button variant="ghost" size="sm" disabled>
                  Connected
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
