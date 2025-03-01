import axiosInstance from "@/constants/baseurl";

export async function putFollow(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/users/${id}/follow`, {
    id,
  });
  return response.data;
}
