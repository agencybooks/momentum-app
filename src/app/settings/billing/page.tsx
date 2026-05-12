import { getSettingsData } from "@/lib/db/services"
import { BillingContent } from "@/components/settings/billing-content"
import { CURRENT_USER_ROLE } from "@/lib/db/settings-data"

export default async function BillingPage() {
  const data = await getSettingsData()
  return <BillingContent billing={data.billing} currentUserRole={CURRENT_USER_ROLE} />
}
