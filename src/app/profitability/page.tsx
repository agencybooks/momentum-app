import { getProfitabilityData } from "@/lib/db/services"
import { ProfitabilityContent } from "@/components/profitability-content"

export default async function ProfitabilityPage() {
  const data = await getProfitabilityData()
  return <ProfitabilityContent data={data} />
}
