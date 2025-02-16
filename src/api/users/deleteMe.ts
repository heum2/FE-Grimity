import BASE_URL from "@/constants/baseurl";

export async function deleteMe(): Promise<Response> {
  const response = await BASE_URL.delete("/users/me");
  return response.data;
}
