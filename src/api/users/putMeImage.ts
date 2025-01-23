import BASE_URL from "@/constants/baseurl";

export async function putProfileImage(imageName: string): Promise<Response> {
  const response = await BASE_URL.put("/users/me/image", {
    imageName,
  });
  return response.data;
}
