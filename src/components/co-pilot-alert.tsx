import * as React from "react"
import { Alert as AlertType } from "@/lib/db/types"
import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, CheckCircle, ChevronRight } from "lucide-react"

export function CoPilotAlert({
  title,
  message,
  type,
  linkTo,
  drawerTrigger,
}: AlertType) {
  const isCritical = type === "critical"
  const isWarning = type === "warning"
  const isSuccess = type === "success"

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-4 text-sm transition-colors",
        isCritical && "border-destructive/20 bg-destructive/10 text-foreground",
        isWarning && "border-border bg-muted/50 text-foreground",
        isSuccess && "border-success/20 bg-success/10 text-success",
        !isCritical && !isWarning && !isSuccess && "border-border bg-card text-foreground"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isCritical && <AlertTriangle className="h-5 w-5 text-destructive" />}
        {isWarning && <AlertCircle className="h-5 w-5 text-muted-foreground" />}
        {isSuccess && <CheckCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{title}</p>
        <p className={cn(
          "leading-snug",
          isCritical && "text-foreground/80",
          isWarning && "text-muted-foreground",
          isSuccess && "text-success/80",
          !isCritical && !isWarning && !isSuccess && "text-muted-foreground"
        )}>
          {message}
        </p>
      </div>
      {(linkTo || drawerTrigger) && (
        <div className="mt-0.5 shrink-0 opacity-70">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
