import { useState } from "react";
import BASE_URL from "@/constants/baseurl";

export interface Feed {
  id: string;
  title: string;
  content?: string;
  cards?: string[];
  thumbnail: string;
  likeCount: number;
  viewCount: number;
  commentCount?: number;
  createdAt: string;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    image?: string;
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
        cards: feed.cards?.map((card) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: feed.author.image ? `https://image.grimity.com/${feed.author.image}` : undefined,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching TodayPopular:", error);
    throw new Error("Failed to fetch TodayPopular");
  }
}

export function useTodayPopular(size: number) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchTodayPopular = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getTodayPopular(nextCursor, size);
      setFeeds((prev) => [...prev, ...response.feeds]);
      setNextCursor(response.nextCursor || undefined);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch TodayPopular:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: { feeds },
    fetchTodayPopular,
    isLoading,
    hasMore,
  };
}
