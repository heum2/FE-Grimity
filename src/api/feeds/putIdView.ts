import axiosInstance from "@/constants/baseurl";

export async function putView(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}/view`, {
    id,
  });
  return response.data;
}
