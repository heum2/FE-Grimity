import axiosInstance from "@/constants/baseurl";

export async function putPostsCommentLike(id: string): Promise<void> {
  await axiosInstance.put(`/post-comments/${id}/like`, {
    id,
  });
  return;
}

export async function deletePostsCommentLike(id: string): Promise<void> {
  await axiosInstance.delete(`/post-comments/${id}/like`);
  return;
}
