import axiosInstance from "@/constants/baseurl";

export async function putPostsSave(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/posts/${id}/save`, {
    id,
  });
  return response.data;
}

export async function deletePostsSave(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/posts/${id}/save`);
  return response.data;
}
