import BASE_URL from "@/constants/baseurl";

export async function putFollow(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/users/${id}/follow`, {
    id,
  });
  return response.data;
}
