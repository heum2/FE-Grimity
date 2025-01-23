import BASE_URL from "@/constants/baseurl";

export interface EditFeedsRequest {
  title: string;
  cards: string[];
  isAI: boolean;
  content: string;
  tags: string[];
}

export async function putEditFeeds(
  id: string,
  { title, cards, isAI, content, tags }: EditFeedsRequest
): Promise<Response> {
  const response = await BASE_URL.put(`/feeds/${id}`, {
    title,
    cards,
    isAI,
    content,
    tags,
  });
  return response.data;
}
