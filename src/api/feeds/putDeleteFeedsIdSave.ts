import BASE_URL from "@/constants/baseurl";

export async function putSave(id: string): Promise<Response> {
  const response = await BASE_URL.put(`/feeds/${id}/save`, {
    id,
  });
  return response.data;
}

export async function deleteSave(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feeds/${id}/save`);
  return response.data;
}
