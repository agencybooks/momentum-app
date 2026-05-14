import { Suspense } from "react"
import { ProfitabilitySkeleton } from "@/components/skeletons/page-specific-skeletons"
import { getProfitabilityData } from "@/lib/db/services"
import { ProfitabilityContent } from "@/components/profitability-content"

export default async function ProfitabilityPage() {
  const data = await getProfitabilityData()
  return (
    <Suspense fallback={<ProfitabilitySkeleton />}>
      <ProfitabilityContent data={data} />
    </Suspense>
  )
}
