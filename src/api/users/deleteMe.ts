import BASE_URL from "@/constants/baseurl";

export async function deleteMe(): Promise<Response> {
  const response = await BASE_URL.delete("/users/me");

  if (response.status === 200) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  }

  return response.data;
}
