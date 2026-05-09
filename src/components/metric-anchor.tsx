import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface MetricAnchorProps {
  title: string
  value: string | number
  target?: string
  trendText?: string
  isHealthy: boolean
  className?: string
}

export function MetricAnchor({
  title,
  value,
  target,
  trendText,
  isHealthy,
  className,
}: MetricAnchorProps) {
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-card-foreground tabular-nums tracking-tight">
          {value}
        </div>
        {(target || trendText) && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trendText && (
              <div
                className={cn(
                  "flex items-center gap-1.5 font-medium",
                  isHealthy ? "text-success" : "text-destructive"
                )}
              >
                <div 
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isHealthy ? "bg-success" : "bg-destructive"
                  )} 
                />
                <span>{trendText}</span>
              </div>
            )}
            {target && (
              <div className="text-muted-foreground">
                vs {target}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
