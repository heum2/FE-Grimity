import axiosInstance from "@/constants/baseurl";

export async function deleteMyFollowers(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/users/me/followers/${id}`);
  return response.data;
}
