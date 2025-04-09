import axiosInstance from "@/constants/baseurl";
import type { CreateFeedRequest } from "@grimity/dto";
export type { CreateFeedRequest };

export async function putEditFeeds(
  id: string,
  { title, cards, content, tags, thumbnail }: CreateFeedRequest,
): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}`, {
    title,
    cards,
    content,
    tags,
    thumbnail,
  });
  return response.data;
}
