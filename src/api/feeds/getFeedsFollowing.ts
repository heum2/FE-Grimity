import BASE_URL from "@/constants/baseurl";
import { useState } from "react";
import { useQuery } from "react-query";

export interface FollowingFeedsRequest {
  size?: number;
  cursor?: string;
}

export interface FollowingFeed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  content: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAI: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
  isLike: boolean;
  isSave: boolean;
  tags: string;
}

export interface FollowingFeedsResponse {
  nextCursor: string | null;
  feeds: FollowingFeed[];
}

export async function getFollowingFeeds({
  size,
  cursor,
}: FollowingFeedsRequest): Promise<FollowingFeedsResponse> {
  try {
    const response = await BASE_URL.get("/feeds/following", { params: { size, cursor } });

    const updatedData: FollowingFeedsResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FollowingFeed) => ({
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
    console.error("Error fetching FollowingFeeds:", error);
    throw new Error("Failed to fetch FollowingFeeds");
  }
}

export function useFollowingNew(params: FollowingFeedsRequest) {
  return useQuery<FollowingFeedsResponse>(["FollowingFeedsNew", params.cursor, params.size], () =>
    getFollowingFeeds(params)
  );
}

export function useFollowingFeeds(params: FollowingFeedsRequest | null) {
  const [feeds, setFeeds] = useState<FollowingFeed[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollowingFeeds = async () => {
    if (!hasMore || isLoading || !params) return;

    setIsLoading(true);
    try {
      const response = await getFollowingFeeds({
        ...params,
        cursor: nextCursor || undefined,
      });
      setFeeds((prev) => [...prev, ...response.feeds]);
      setNextCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch following feeds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    feeds,
    fetchFollowingFeeds,
    isLoading,
    hasMore,
  };
}
