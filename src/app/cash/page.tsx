import { getCashData, getOpenInvoices, getAlerts, getClients } from "@/lib/db/services"
import { CashPageContent } from "@/components/cash-page-content"

export const dynamic = "force-dynamic"

export default async function CashPage() {
  const [cashData, openInvoices, alerts, clients] = await Promise.all([
    getCashData(),
    getOpenInvoices(),
    getAlerts(),
    getClients(),
  ])

  return <CashPageContent cashData={cashData} openInvoices={openInvoices} alerts={alerts} clients={clients} />
}
