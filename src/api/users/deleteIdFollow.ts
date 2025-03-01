import axiosInstance from "@/constants/baseurl";

export async function deleteFollow(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/users/${id}/follow`);
  return response.data;
}
