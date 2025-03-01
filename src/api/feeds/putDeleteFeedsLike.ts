import axiosInstance from "@/constants/baseurl";

export async function putLike(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}/like`, {
    id,
  });
  return response.data;
}

export async function deleteLike(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}/like`);
  return response.data;
}
