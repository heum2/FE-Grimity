import BASE_URL from "@/constants/baseurl";

export async function putNotifications(): Promise<Response> {
  const response = await BASE_URL.put("/notifications");
  return response.data;
}

export async function putNotificationsId(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/notifications/${id}`, {
    id,
  });
  return response.data;
}
