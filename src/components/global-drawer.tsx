"use client"

import * as React from "react"
import { useQueryState } from "nuqs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ARIntelligenceDrawer } from "@/components/drawers/ar-intelligence-drawer"
import { ActionCenterDrawer } from "@/components/drawers/action-center-drawer"
import { ClientLedgerDrawer } from "@/components/drawers/client-ledger-drawer"

export function GlobalDrawer() {
  const [drawer, setDrawer] = useQueryState("drawer")
  const [clientId, setClientId] = useQueryState("clientId")

  const isOpen = typeof drawer === "string" && drawer.length > 0

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDrawer(null)
      setClientId(null)
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
    default:
      content = null
  }

  const isMacroDrawer = drawer === 'client-ledger'
  const widthClass = isMacroDrawer 
    ? 'sm:!max-w-[50vw] w-full' 
    : 'sm:!max-w-[30vw] sm:min-w-[420px] w-full'

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className={widthClass}>
        {content}
      </SheetContent>
    </Sheet>
  )
}
