import BASE_URL from "@/constants/baseurl";

export async function putPostsCommentLike(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/post-comments/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deletePostsCommentLike(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/post-comments/${id}/like`);
  return response.data;
}
