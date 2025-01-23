import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface NotificationsResponse {
  type: "LIKE" | "COMMENT" | "FOLLOW";
  id: string;
  actorId: string;
  actorName: string;
  createdAt: string;
  isRead: boolean;
  feedId?: string;
}

export async function getNotifications(): Promise<NotificationsResponse[]> {
  const response = await BASE_URL.get("/notifications");
  return response.data;
}

export function useGetNotifications() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<NotificationsResponse[]>("getNotifications", getNotifications, {
    enabled: Boolean(accessToken),
  });
}
