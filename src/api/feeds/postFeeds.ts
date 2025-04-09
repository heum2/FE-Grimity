import axiosInstance from "@/constants/baseurl";
import type { CreateFeedRequest, IdResponse } from "@grimity/dto";
export type { CreateFeedRequest, IdResponse };

export async function postFeeds({
  title,
  cards,
  content,
  tags,
  thumbnail,
}: CreateFeedRequest): Promise<IdResponse> {
  const response = await axiosInstance.post("/feeds", {
    title,
    cards,
    content,
    tags,
    thumbnail,
  });
  return response.data;
}
