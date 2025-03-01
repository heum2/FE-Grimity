import axiosInstance from "@/constants/baseurl";

export async function putNotifications(): Promise<Response> {
  const response = await axiosInstance.put("/notifications");
  return response.data;
}

export async function putNotificationsId(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/notifications/${id}`, {
    id,
  });
  return response.data;
}
