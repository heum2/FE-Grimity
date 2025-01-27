import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface Feed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
}

export interface TodayPopularResponse {
  feeds: Feed[];
  nextCursor: string | null;
}

export async function getTodayPopular(
  cursor?: string,
  size?: number
): Promise<TodayPopularResponse> {
  try {
    const response = await BASE_URL.get("/feeds/today-popular", {
      params: {
        cursor,
        size,
      },
    });

    const updatedData: TodayPopularResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: Feed) => ({
        ...feed,
        cards: feed.cards.map((card) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching TodayPopular:", error);
    throw new Error("Failed to fetch TodayPopular");
  }
}

export function useTodayPopular(cursor?: string, size?: number) {
  return useQuery<TodayPopularResponse>(["TodayPopular", cursor, size], () =>
    getTodayPopular(cursor, size)
  );
}
