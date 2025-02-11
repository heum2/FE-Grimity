import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";
import { NotificationData } from "@grimity/shared-types";

export interface NotificationsResponse {
  id: string;
  createdAt: string;
  isRead: boolean;
  data: NotificationData;
}

export async function getNotifications(): Promise<NotificationsResponse[]> {
  const response = await BASE_URL.get("/notifications");
  return response.data as NotificationsResponse[];
}

export function useGetNotifications() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<NotificationsResponse[]>("getNotifications", getNotifications, {
    enabled: Boolean(accessToken),
  });
}
