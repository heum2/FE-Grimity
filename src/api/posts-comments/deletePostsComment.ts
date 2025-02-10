import BASE_URL from "@/constants/baseurl";

export async function deletePostsComments(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/post-comments/${id}`);
  return response.data;
}
