import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export async function deleteFeeds(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feeds/${id}`);
  return response.data;
}

export function useDeleteFeeds(id: string) {
  return useQuery<Response>(["deleteFeeds", id], () => deleteFeeds(id), {});
}
