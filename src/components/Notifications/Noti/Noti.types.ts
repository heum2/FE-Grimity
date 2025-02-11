import { NotificationsResponse } from "@/api/notifications/getNotifications";

export interface NotiProps {
  notification: NotificationsResponse;
  onClose: () => void;
  onRefetch: () => void;
}
