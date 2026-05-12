import { getSettingsData } from "@/lib/db/services"
import { NotificationsContent } from "@/components/settings/notifications-content"

export default async function NotificationsPage() {
  const data = await getSettingsData()
  return <NotificationsContent notifications={data.notifications} />
}
