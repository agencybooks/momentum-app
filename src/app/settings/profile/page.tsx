import { getSettingsData } from "@/lib/db/services"
import { ProfileContent } from "@/components/settings/profile-content"

export default async function ProfilePage() {
  const data = await getSettingsData()
  return <ProfileContent profile={data.profile} />
}
