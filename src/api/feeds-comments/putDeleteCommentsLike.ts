import BASE_URL from "@/constants/baseurl";

export async function putCommentLike(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/feed-comments/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deleteCommentLike(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feed-comments/${id}/like`);
  return response.data;
}
