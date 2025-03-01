import axiosInstance from "@/constants/baseurl";

export async function deletePostsComments(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/post-comments/${id}`);
  return response.data;
}
