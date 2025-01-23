import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export async function deleteComments(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/feed-comments/${id}`);
  return response.data;
}
