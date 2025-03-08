import axiosInstance from "@/constants/baseurl";

export interface EditFeedsRequest {
  title: string;
  cards: string[];
  isAI: boolean;
  content: string;
  tags: string[];
  thumbnail: string;
}

export async function putEditFeeds(
  id: string,
  { title, cards, isAI, content, tags, thumbnail }: EditFeedsRequest,
): Promise<Response> {
  const response = await axiosInstance.put(`/feeds/${id}`, {
    title,
    cards,
    isAI,
    content,
    tags,
    thumbnail,
  });
  return response.data;
}
