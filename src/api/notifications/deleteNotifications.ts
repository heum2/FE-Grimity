import BASE_URL from "@/constants/baseurl";

export async function deleteNotifications(): Promise<Response> {
  const response = await BASE_URL.delete("/notifications");
  return response.data;
}
