import axiosInstance from "@/constants/baseurl";
import type { CreatePostRequest } from "@grimity/dto";
export type { CreatePostRequest };

export async function putEditPosts(
  id: string,
  { title, content, type }: CreatePostRequest,
): Promise<Response> {
  const response = await axiosInstance.put(`/posts/${id}`, {
    title,
    content,
    type,
  });
  return response.data;
}
