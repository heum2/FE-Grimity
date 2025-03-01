import axiosInstance from "@/constants/baseurl";

export async function putCommentLike(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/feed-comments/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deleteCommentLike(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feed-comments/${id}/like`);
  return response.data;
}
