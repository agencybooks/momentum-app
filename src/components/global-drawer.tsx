// Re-written global-drawer.tsx
"use client"

import * as React from "react"
import { useState, useEffect, Suspense, lazy } from "react"
import { useQueryState } from "nuqs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DrawerSkeleton } from "@/components/skeletons/drawer-skeleton"

import { ARIntelligenceDrawer } from "@/components/drawers/ar-intelligence-drawer"
import { ActionCenterDrawer } from "@/components/drawers/action-center-drawer"
import { ClientLedgerDrawer } from "@/components/drawers/client-ledger-drawer"
import { ActionInsightDrawer } from "@/components/drawers/action-insight-drawer"
import { CopilotFeedDrawer } from "@/components/drawers/copilot-feed-drawer"
import { ClientProfileDrawer } from "@/components/drawers/client-profile-drawer"

// Existing complex drawers
import { CashTrendDrawerContent, CASH_TREND_DRAWER_IDS } from "@/components/drawers/cash-trend-drawers"
import { ProfitabilityTrendDrawerContent, PROFITABILITY_TREND_DRAWER_IDS } from "@/components/drawers/profitability-trend-drawers"
import { ExpenseDepartmentDrawerContent, EXPENSE_DEPARTMENT_DRAWER_IDS } from "@/components/drawers/expense-department-drawers"
import { GrowthTrendDrawerContent, GROWTH_TREND_DRAWER_IDS } from "@/components/drawers/growth-trend-drawers"
import { ClientsKpiDrawerContent, CLIENTS_KPI_DRAWER_IDS } from "@/components/drawers/clients-kpi-drawers"
import { AntiPnlSnapshotDrawer } from "@/components/drawers/anti-pnl-snapshot-drawer"

// Lazy loaded simple drawers
const M4Drawer = lazy(() => import("@/components/drawers/m4-drawer"))
const M5Drawer = lazy(() => import("@/components/drawers/m5-drawer"))
const M6Drawer = lazy(() => import("@/components/drawers/m6-drawer"))
const M7Drawer = lazy(() => import("@/components/drawers/m7-drawer"))
const M8Drawer = lazy(() => import("@/components/drawers/m8-drawer"))
const U4Drawer = lazy(() => import("@/components/drawers/u4-drawer"))
const U1Drawer = lazy(() => import("@/components/drawers/u1-drawer"))
const U2Drawer = lazy(() => import("@/components/drawers/u2-drawer"))
const U3Drawer = lazy(() => import("@/components/drawers/u3-drawer"))
const M10Drawer = lazy(() => import("@/components/drawers/m10-drawer"))
const UniversalLedgerDrawer = lazy(() => import("@/components/drawers/universal-ledger-drawer"))
const RetainersDrawer = lazy(() => import("@/components/drawers/retainers-drawer"))
const ProjectsDrawer = lazy(() => import("@/components/drawers/projects-drawer"))
const FreelancerDrawer = lazy(() => import("@/components/drawers/freelancer-drawer"))
const HostingDrawer = lazy(() => import("@/components/drawers/hosting-drawer"))
const SoftwareDrawer = lazy(() => import("@/components/drawers/software-drawer"))
const PayrollDrawer = lazy(() => import("@/components/drawers/payroll-drawer"))
const SubsDrawer = lazy(() => import("@/components/drawers/subs-drawer"))
const MarketingDrawer = lazy(() => import("@/components/drawers/marketing-drawer"))
const InterestDrawer = lazy(() => import("@/components/drawers/interest-drawer"))
const ClientsNrrDrawer = lazy(() => import("@/components/drawers/clients-nrr-drawer"))
const ClientsChurnWaterfallDrawer = lazy(() => import("@/components/drawers/clients-churn-waterfall-drawer"))

export function GlobalDrawer() {
  const [drawer, setDrawer] = useQueryState("drawer")
  const [clientId, setClientId] = useQueryState("clientId")
  const [, setPeriod] = useQueryState("period")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setDrawer("universal-ledger")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setDrawer])

  const isOpen = !!drawer

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDrawer(null)
      setClientId(null)
      setPeriod(null)
      setIsFullscreen(false)
    }
  }

  const isContextDrawer = drawer === "action-center" || drawer === "test"
  const isCopilotDrawer = drawer === "copilot-feed"
  const isClientProfileDrawer = drawer === "client-profile"

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
    case "client-profile":
      content = <ClientProfileDrawer clientId={clientId} />
      break
    case "copilot-feed":
      content = <CopilotFeedDrawer />
      break
    case "m9":
    case "m2":
    case "m1":
    case "m3":
      content = <CashTrendDrawerContent drawerId={drawer} />
      break
    case "m4": content = <M4Drawer />; break;
    case "m5": content = <M5Drawer />; break;
    case "m6": content = <M6Drawer />; break;
    case "m7": content = <M7Drawer />; break;
    case "m8": content = <M8Drawer />; break;
    case "u4": content = <U4Drawer />; break;
    case "u1": content = <U1Drawer />; break;
    case "u2": content = <U2Drawer />; break;
    case "u3": content = <U3Drawer />; break;
    case "m10": content = <M10Drawer />; break;
    case "universal-ledger": content = <UniversalLedgerDrawer />; break;
    case "retainers": content = <RetainersDrawer />; break;
    case "projects": content = <ProjectsDrawer />; break;
    case "freelancer": content = <FreelancerDrawer />; break;
    case "hosting": content = <HostingDrawer />; break;
    case "software": content = <SoftwareDrawer />; break;
    case "payroll": content = <PayrollDrawer />; break;
    case "subs": content = <SubsDrawer />; break;
    case "marketing": content = <MarketingDrawer />; break;
    case "interest": content = <InterestDrawer />; break;
    case "clients-nrr": content = <ClientsNrrDrawer />; break;
    case "clients-churn-waterfall": content = <ClientsChurnWaterfallDrawer />; break;
    case "gross-margin-trend":
    case "op-margin-trend":
    case "net-margin-trend":
    case "revenue-trend":
    case "cogs-trend":
    case "gross-profit-trend":
    case "rev-per-fte-trend":
      content = <ProfitabilityTrendDrawerContent drawerId={drawer} />
      break
    case "payroll-delivery":
    case "payroll-marketing":
    case "payroll-sales":
    case "payroll-admin":
    case "software-delivery":
    case "software-marketing":
    case "software-sales":
    case "software-admin":
      content = <ExpenseDepartmentDrawerContent drawerId={drawer} />
      break
    case "nrr-trend":
    case "blended-cac-trend":
    case "cac-payback-trend":
    case "ltv-cac-trend":
      content = <GrowthTrendDrawerContent drawerId={drawer} />
      break
    case "clients-total-mrr":
    case "clients-blended-margin":
    case "clients-rev-concentration":
    case "clients-profit-concentration":
      content = <ClientsKpiDrawerContent drawerId={drawer} />
      break
    case "clients-concentration":
      content = <ClientsKpiDrawerContent drawerId="clients-rev-concentration" />
      break
    case "anti-pnl-snapshot":
      content = <AntiPnlSnapshotDrawer />
      break
    default:
      content = null
  }

  const widthClass = isFullscreen
    ? "!left-0 !right-0 !mx-auto !w-[calc(100vw-32px)] !max-w-7xl transition-all duration-300 ease-in-out"
    : isClientProfileDrawer
      ? "w-[95vw] sm:w-[50vw]"
      : isCopilotDrawer
        ? "w-[95vw] sm:w-[var(--drawer-width-copilot)]"
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
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
        <div className={cn(
          "flex flex-col h-full",
          !isContextDrawer && "mx-auto w-full max-w-4xl"
        )}>
          <Suspense fallback={<DrawerSkeleton />}>
            {content}
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  )
}
