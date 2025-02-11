import BASE_URL from "@/constants/baseurl";

export async function deleteNotifications(): Promise<Response> {
  const response = await BASE_URL.delete("/notifications");
  return response.data;
}

export async function deleteNotificationsId(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/notifications/${id}`);
  return response.data;
}
