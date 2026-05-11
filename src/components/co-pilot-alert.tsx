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
        "flex w-full flex-col sm:flex-row sm:items-center justify-between p-3 px-4 mb-6 text-sm transition-colors text-foreground",
        isCritical && "border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-lg",
        isWarning && "border border-amber-500/20 bg-amber-500/5 rounded-lg",
        isSuccess && "border border-success/20 bg-success/5 rounded-lg",
        !isCritical && !isWarning && !isSuccess && "bg-muted/50 rounded-lg"
      )}
    >
      <div className="flex items-start sm:items-center gap-3">
        {isCritical && <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5 sm:mt-0" />}
        {isWarning && <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 sm:mt-0 shrink-0" />}
        {isSuccess && <CheckCircle className="w-5 h-5 text-success mt-0.5 sm:mt-0 shrink-0" />}
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground ml-0 sm:ml-2">
            {message}
          </p>
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
      {(linkTo || drawerTrigger) && !actions && (
        <div className="shrink-0 opacity-70">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
