import BASE_URL from "@/constants/baseurl";
import { useInfiniteQuery, useQuery } from "react-query";
import { Feed } from "./getTodayPopular";

export interface FeedsLatestRequest {
  size?: number;
  cursor?: string;
}

export interface FeedsLatestResponse {
  feeds: Feed[];
  nextCursor: string | null;
}

export async function getFeedsLatest({
  size,
  cursor,
}: FeedsLatestRequest): Promise<FeedsLatestResponse> {
  try {
    const response = await BASE_URL.get("/feeds/latest", {
      params: { size, cursor },
    });

    const updatedData: FeedsLatestResponse = {
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
    console.error("Error fetching FeedsLatest:", error);
    throw new Error("Failed to fetch FeedsLatest");
  }
}

export function useFeedsLatest({ size }: FeedsLatestRequest) {
  return useInfiniteQuery<FeedsLatestResponse>(
    "feedsLatest",
    ({ pageParam = null }) => getFeedsLatest({ size, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    }
  );
}
