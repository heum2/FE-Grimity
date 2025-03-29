import axiosInstance from "@/constants/baseurl";
import type { UpdateUserRequest, UpdateProfileConflictResponse } from "@grimity/dto";
export type { UpdateUserRequest, UpdateProfileConflictResponse };

export interface Response {
  success: boolean;
  message: string;
}

export async function putMyInfo({
  name,
  description,
  links,
  url,
}: UpdateUserRequest): Promise<void> {
  await axiosInstance.put("/users/me", {
    name,
    description,
    links,
    url,
  });
  return;
}
