import axiosInstance from "@/constants/baseurl";

export async function putSave(id: string): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}/save`, {
    id,
  });
  return response.data;
}

export async function deleteSave(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}/save`);
  return response.data;
}
