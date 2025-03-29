import axiosInstance from "@/constants/baseurl";

export async function putFollow(id: string): Promise<void> {
  await axiosInstance.put(`/users/${id}/follow`, {
    id,
  });
  return;
}
