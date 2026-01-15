import axiosInstance from "@/constants/baseurl";

export async function deleteFeedsLike(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}/like`);
  return response.data;
}
