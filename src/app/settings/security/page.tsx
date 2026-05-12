import { getSettingsData } from "@/lib/db/services"
import { SecurityContent } from "@/components/settings/security-content"

export default async function SecurityPage() {
  const data = await getSettingsData()
  return <SecurityContent security={data.security} />
}
