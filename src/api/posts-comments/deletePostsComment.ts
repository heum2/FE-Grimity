import axiosInstance from "@/constants/baseurl";

export async function deletePostsComments(id: string): Promise<void> {
  const response = await axiosInstance.delete(`/post-comments/${id}`);
  return;
}
