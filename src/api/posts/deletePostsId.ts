import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export async function deletePostsFeeds(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/posts/${id}`);
  return response.data;
}
