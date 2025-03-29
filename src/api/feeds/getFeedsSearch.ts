import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { SearchedFeedsResponse } from "@grimity/dto";

export interface FeedSearchRequest {
  sort?: "latest" | "popular" | "accuracy";
  size?: number;
  cursor?: string;
  keyword: string;
}

export async function getFeedSearch({
  sort,
  size,
  cursor,
  keyword,
}: FeedSearchRequest): Promise<SearchedFeedsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/search", {
      params: {
        sort,
        size,
        cursor,
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching FeedSearch:", error);
    throw new Error("Failed to fetch FeedSearch");
  }
}

export function useFeedSearch(params: FeedSearchRequest) {
  return useInfiniteQuery(
    ["FeedSearch", params.keyword, params.sort],
    ({ pageParam = undefined }) => getFeedSearch({ ...params, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ? lastPage.nextCursor : undefined;
      },
      enabled: !!params.keyword,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
