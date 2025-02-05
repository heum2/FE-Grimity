import BASE_URL from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface FeedSearchRequest {
  sort?: "latest" | "popular";
  size?: number;
  cursor?: string;
  keyword: string;
}

export interface FeedSearch {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLike: boolean;
  tags: string[];
  author: {
    id: string;
    name: string;
  };
}

export interface FeedSearchResponse {
  nextCursor: string | null;
  feeds: FeedSearch[];
}

export async function getFeedSearch({
  sort,
  size,
  cursor,
  keyword,
}: FeedSearchRequest): Promise<FeedSearchResponse> {
  try {
    const response = await BASE_URL.get("/feeds/search", {
      params: {
        sort,
        size,
        cursor,
        keyword,
      },
    });

    const updatedData: FeedSearchResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FeedSearch) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching FeedSearch:", error);
    throw new Error("Failed to fetch FeedSearch");
  }
}

export function useFeedSearch(params: FeedSearchRequest) {
  return useInfiniteQuery(
    ["FeedSearch", params.keyword, params.sort],
    ({ pageParam = null }) => getFeedSearch({ ...params, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!params.keyword,
    }
  );
}
