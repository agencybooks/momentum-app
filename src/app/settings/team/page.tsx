import { getSettingsData } from "@/lib/db/services"
import { TeamContent } from "@/components/settings/team-content"
import { CURRENT_USER_ROLE } from "@/lib/db/settings-data"

export default async function TeamPage() {
  const data = await getSettingsData()
  return <TeamContent team={data.team} currentUserRole={CURRENT_USER_ROLE} />
}
