import axiosInstance from "@/constants/baseurl";

export async function deleteMyProfileImage(): Promise<Response> {
  const response = await axiosInstance.delete("/users/me/image");
  return response.data;
}

export async function deleteMyBackgroundImage(): Promise<Response> {
  const response = await axiosInstance.delete("/users/me/background");
  return response.data;
}
