import BASE_URL from "@/constants/baseurl";

export async function putView(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/feeds/${id}/view`, {
    id,
  });
  return response.data;
}
