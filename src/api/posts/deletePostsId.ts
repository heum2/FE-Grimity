import axiosInstance from "@/constants/baseurl";

export async function deletePostsFeeds(id: string): Promise<void> {
  await axiosInstance.delete(`/posts/${id}`);
  return;
}
