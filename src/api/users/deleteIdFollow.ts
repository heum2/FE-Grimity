import BASE_URL from "@/constants/baseurl";

export async function deleteFollow(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/users/${id}/follow`);
  return response.data;
}
