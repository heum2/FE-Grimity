import axiosInstance from "@/constants/baseurl";

export async function deleteMyProfileImage(): Promise<void> {
  await axiosInstance.delete("/me/image");
  return;
}

export async function deleteMyBackgroundImage(): Promise<void> {
  await axiosInstance.delete("/me/background");
  return;
}
