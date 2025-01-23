import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FeedsRequest {
  tag?: string;
  lastCreatedAt?: string;
  lastId?: string;
}

export interface FeedsResponse {
  id: string;
  title: string;
  cards: string[];
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLike: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
}

export async function getFeeds({
  tag,
  lastCreatedAt,
  lastId,
}: FeedsRequest): Promise<FeedsResponse[]> {
  try {
    const response = await BASE_URL.get("/feeds", {
      params: { tag, lastCreatedAt, lastId, limit: 12 },
    });

    const updatedData = response.data.map((data: FeedsResponse) => ({
      ...data,
      cards: data.cards.map((card) => `https://image.grimity.com/${card}`),
      author: {
        ...data.author,
        image: `https://image.grimity.com/${data.author.image}`,
      },
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching Feeds:", error);
    throw new Error("Failed to fetch Feeds");
  }
}

export function useFeeds({ tag, lastCreatedAt, lastId }: FeedsRequest) {
  return useQuery<FeedsResponse[]>(["feeds", tag, lastCreatedAt, lastId], () =>
    getFeeds({ tag, lastCreatedAt, lastId })
  );
}
