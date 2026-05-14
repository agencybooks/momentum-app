import { Suspense } from "react"
import { ClientsSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { getClientsPageData } from "@/lib/db/services"
import { ClientsPageContent } from "@/components/clients-page-content"

export default async function ClientsPage() {
  const data = await getClientsPageData()

  return (
    <Suspense fallback={<ClientsSkeleton />}>
      <ClientsPageContent data={data} />
    </Suspense>
  )
}
