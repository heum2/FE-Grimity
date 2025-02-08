import BASE_URL from "@/constants/baseurl";

export async function putPostsSave(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/posts/${id}/save`, {
    id,
  });
  return response.data;
}

export async function deletePostsSave(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/posts/${id}/save`);
  return response.data;
}
