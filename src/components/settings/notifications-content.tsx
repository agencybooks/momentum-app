"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SettingsData } from "@/lib/db/types"

export function NotificationsContent({
  notifications,
}: {
  notifications: SettingsData["notifications"]
}) {
  const [daily, setDaily] = useState(notifications.emailDigestDaily)
  const [weekly, setWeekly] = useState(notifications.emailDigestWeekly)
  const [slackConnected, setSlackConnected] = useState(notifications.slackConnected)

  function handleToggle(setter: (v: boolean) => void, value: boolean) {
    setter(value)
    toast.success("Preferences saved")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email Digest</CardTitle>
          <CardDescription>Control which summary emails you receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Summary</p>
              <p className="text-sm text-muted-foreground">
                A morning email with yesterday&apos;s key metrics and alerts.
              </p>
            </div>
            <Switch
              checked={daily}
              onCheckedChange={(val) => handleToggle(setDaily, val)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Report</p>
              <p className="text-sm text-muted-foreground">
                A Monday email summarizing the prior week&apos;s performance.
              </p>
            </div>
            <Switch
              checked={weekly}
              onCheckedChange={(val) => handleToggle(setWeekly, val)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
          <CardDescription>Receive real-time alerts in your Slack workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={slackConnected ? "default" : "secondary"}>
                {slackConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <Button
              variant={slackConnected ? "outline" : "default"}
              size="sm"
              onClick={() => {
                setSlackConnected(!slackConnected)
                toast.success(slackConnected ? "Slack disconnected" : "Slack connected")
              }}
            >
              {slackConnected ? "Disconnect" : "Connect Slack"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Critical alerts and cash flow warnings will be sent to your connected Slack channel.
          </p>
        </CardContent>
      </Card>
    </>
  )
}
