import axiosInstance from "@/constants/baseurl";

export async function putFeedsLike(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}/like`, {
    id,
  });
  return response.data;
}
