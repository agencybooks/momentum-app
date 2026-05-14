import { Suspense } from "react"
import { CashSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { getCashData, getOpenInvoices, getAlerts, getClients } from "@/lib/db/services"
import { CashPageContent } from "@/components/cash-page-content"

export default async function CashPage() {
  const [cashData, openInvoices, alerts, clients] = await Promise.all([
    getCashData(),
    getOpenInvoices(),
    getAlerts(),
    getClients(),
  ])

  return (
    <Suspense fallback={<CashSkeleton />}>
      <CashPageContent cashData={cashData} openInvoices={openInvoices} alerts={alerts} clients={clients} />
    </Suspense>
  )
}
