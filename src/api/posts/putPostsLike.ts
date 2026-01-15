import axiosInstance from "@/constants/baseurl";

export async function putPostsLike(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/posts/${id}/like`, {
    id,
  });
  return response.data;
}
