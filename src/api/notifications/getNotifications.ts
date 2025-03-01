import { useQuery } from "react-query";
import { NotificationData } from "@grimity/shared-types";
import axiosInstance from "@/constants/baseurl";

export interface NotificationsResponse {
  id: string;
  createdAt: string;
  isRead: boolean;
  data: NotificationData;
}

export async function getNotifications(): Promise<NotificationsResponse[]> {
  const response = await axiosInstance.get("/notifications");
  return response.data as NotificationsResponse[];
}

export function useGetNotifications() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<NotificationsResponse[]>("getNotifications", getNotifications, {
    enabled: Boolean(accessToken),
  });
}
