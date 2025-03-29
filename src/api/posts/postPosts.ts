import axiosInstance from "@/constants/baseurl";
import type { CreatePostRequest } from "@grimity/dto";
export type { CreatePostRequest };

export interface PostsResponse {
  id: string;
}

export async function postPosts({
  title,
  content,
  type,
}: CreatePostRequest): Promise<PostsResponse> {
  const response = await axiosInstance.post("/posts", {
    title,
    content,
    type,
  });
  return response.data;
}
