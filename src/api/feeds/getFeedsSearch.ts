import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  return useInfiniteQuery<SearchedFeedsResponse>({
    queryKey: ["FeedSearch", params.keyword, params.sort],
    queryFn: ({ pageParam }) =>
      getFeedSearch({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    enabled: !!params.keyword,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
