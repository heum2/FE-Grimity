import BASE_URL from "@/constants/baseurl";

export async function putPostsLike(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/posts/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deletePostsLike(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/posts/${id}/like`);
  return response.data;
}
