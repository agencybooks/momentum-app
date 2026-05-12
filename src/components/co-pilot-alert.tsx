import * as React from "react"
import { Alert as AlertType } from "@/lib/db/types"
import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, CheckCircle, ChevronRight } from "lucide-react"

interface CoPilotAlertProps extends Partial<AlertType> {
  actions?: React.ReactNode
}

export function CoPilotAlert({
  title,
  message,
  type,
  linkTo,
  drawerTrigger,
  actions,
}: CoPilotAlertProps) {
  const isCritical = type === "critical"
  const isWarning = type === "warning"
  const isSuccess = type === "success"

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between p-3 px-4 gap-6 text-sm transition-colors text-foreground",
        isCritical && "border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-lg",
        isWarning && "border border-amber-500/20 bg-amber-500/5 rounded-lg",
        isSuccess && "border border-success/20 bg-success/5 rounded-lg",
        !isCritical && !isWarning && !isSuccess && "bg-muted/50 rounded-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {isCritical && <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
        {isWarning && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
        {isSuccess && <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold leading-none text-foreground whitespace-nowrap">{title}</p>
          <p className="text-xs text-muted-foreground/80 leading-snug">
            {message}
          </p>
        </div>
      </div>
      {actions && <div className="shrink-0 whitespace-nowrap">{actions}</div>}
      {(linkTo || drawerTrigger) && !actions && (
        <div className="shrink-0 opacity-70">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
