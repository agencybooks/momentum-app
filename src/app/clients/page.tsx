import { Suspense } from "react"
import { getClientsPageData } from "@/lib/db/services"
import { ClientsPageContent } from "@/components/clients-page-content"

export default async function ClientsPage() {
  const data = await getClientsPageData()

  return (
    <Suspense>
      <ClientsPageContent data={data} />
    </Suspense>
  )
}
