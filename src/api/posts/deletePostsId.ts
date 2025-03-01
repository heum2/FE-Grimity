import axiosInstance from "@/constants/baseurl";

export async function deletePostsFeeds(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
}
