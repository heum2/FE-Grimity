import BASE_URL from "@/constants/baseurl";

export async function deleteMyProfileImage(): Promise<Response> {
  const response = await BASE_URL.delete("/users/me/image");
  return response.data;
}

export async function deleteMyBackgroundImage(): Promise<Response> {
  const response = await BASE_URL.delete("/users/me/background");
  return response.data;
}
