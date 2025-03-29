import axiosInstance from "@/constants/baseurl";

export async function deleteFollow(id: string): Promise<void> {
  await axiosInstance.delete(`/users/${id}/follow`);
  return;
}
