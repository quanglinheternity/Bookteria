import { NOTIFICATIONS } from "@/lib/mock-data"
import { NotificationsView } from "@/features/notifications/components/notifications-view"

export default function NotificationsPage() {
  return <NotificationsView notifications={NOTIFICATIONS} />
}
