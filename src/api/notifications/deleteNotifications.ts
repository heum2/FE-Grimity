import axiosInstance from "@/constants/baseurl";

export async function deleteNotifications(): Promise<Response> {
  const response = await axiosInstance.delete("/notifications");
  return response.data;
}

export async function deleteNotificationsId(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
}
