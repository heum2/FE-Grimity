import axiosInstance from "@/constants/baseurl";

export async function deleteComments(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feed-comments/${id}`);
  return response.data;
}
