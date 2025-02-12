import { useEffect, useState } from "react";
import BASE_URL from "@/constants/baseurl";

export interface PopularFeed {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
}

export interface PopularFeedResponse {
  feeds: PopularFeed[];
  nextCursor: string | null;
}

export async function getPopularFeed(cursor: string | null = null): Promise<PopularFeedResponse> {
  try {
    const response = await BASE_URL.get("/feeds/popular", {
      params: {
        cursor,
        size: 30,
      },
    });

    return {
      ...response.data,
      feeds: response.data.feeds.map((feed: PopularFeed) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopularFeed() {
  const [data, setData] = useState<PopularFeed[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNextPage = async () => {
    if (isLoading || nextCursor === undefined) return;
    setIsLoading(true);

    try {
      const response = await getPopularFeed(nextCursor);
      setData((prevData) => [...prevData, ...response.feeds]);
      setNextCursor(response.nextCursor);
    } catch (err: any) {
      console.error("Error fetching next page:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextPage();
  }, []);

  return {
    data,
    fetchNextPage,
    isLoading,
    hasMore: nextCursor !== null,
  };
}
