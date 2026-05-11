"use client"

import * as React from "react"
import { useState } from "react"
import { useQueryState } from "nuqs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ARIntelligenceDrawer } from "@/components/drawers/ar-intelligence-drawer"
import { ActionCenterDrawer } from "@/components/drawers/action-center-drawer"
import { ClientLedgerDrawer } from "@/components/drawers/client-ledger-drawer"
import { ActionInsightDrawer } from "@/components/drawers/action-insight-drawer"

export function GlobalDrawer() {
  const [drawer, setDrawer] = useQueryState("drawer")
  const [clientId, setClientId] = useQueryState("clientId")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const globalDrawerIds = ["test", "ar-intelligence", "action-center", "client-ledger", "action-insight"]
  const contextDrawerIds = ["test", "action-center"]
  const isOpen = typeof drawer === "string" && globalDrawerIds.includes(drawer)
  const isContextDrawer = contextDrawerIds.includes(drawer ?? "")

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDrawer(null)
      setClientId(null)
      setIsFullscreen(false)
    }
  }

  let content = null

  switch (drawer) {
    case "test":
      content = <div>Drawer Engine is Live</div>
      break
    case "ar-intelligence":
      content = <ARIntelligenceDrawer clientId={clientId} />
      break
    case "action-center":
      content = <ActionCenterDrawer />
      break
    case "client-ledger":
      content = <ClientLedgerDrawer clientId={clientId} />
      break
    case "action-insight":
      content = <ActionInsightDrawer clientId={clientId} />
      break
    default:
      content = null
  }

  const widthClass = isFullscreen
    ? "!left-0 !right-0 !mx-auto !w-[calc(100vw-32px)] !max-w-7xl transition-all duration-300 ease-in-out"
    : isContextDrawer
      ? "w-[90vw] sm:w-[var(--drawer-width-context)]"
      : "w-[95vw] sm:w-[var(--drawer-width-master)]"

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className={cn("overflow-y-auto", widthClass)}>
        {!isContextDrawer && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-12 top-3 z-10"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
        <div className={cn(
          "flex flex-col h-full",
          !isContextDrawer && "mx-auto w-full max-w-4xl"
        )}>
          {content}
        </div>
      </SheetContent>
    </Sheet>
  )
}
