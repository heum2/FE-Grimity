import BASE_URL from "@/constants/baseurl";

export async function putLike(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/feeds/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deleteLike(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feeds/${id}/like`);
  return response.data;
}
