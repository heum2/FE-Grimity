import BASE_URL from "@/constants/baseurl";

export interface FeedsRequest {
  title: string;
  cards: string[];
  isAI: boolean;
  content: string;
  tags: string[];
}

export interface FeedsResponse {
  id: string;
}

export async function postFeeds({
  title,
  cards,
  isAI,
  content,
  tags,
}: FeedsRequest): Promise<FeedsResponse> {
  const response = await BASE_URL.post("/feeds", {
    title,
    cards,
    isAI,
    content,
    tags,
  });
  return response.data;
}
