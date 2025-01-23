import BASE_URL from "@/constants/baseurl";

export async function deleteLike(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feeds/${id}/like`);
  return response.data;
}
