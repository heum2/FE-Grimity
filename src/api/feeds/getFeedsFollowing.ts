import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import type { FollowingFeedsResponse } from "@grimity/dto";
export type { FollowingFeedsResponse };

export interface FollowingFeedsRequest {
  size?: number;
  cursor?: string;
}

export async function getFollowingFeeds({
  size,
  cursor,
}: FollowingFeedsRequest): Promise<FollowingFeedsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/following", { params: { size, cursor } });

    return response.data;
  } catch (error) {
    console.error("Error fetching FollowingFeeds:", error);
    throw new Error("Failed to fetch FollowingFeeds");
  }
}

export function useFollowingFeeds(params: FollowingFeedsRequest | null, enabled?: boolean) {
  return useInfiniteQuery<FollowingFeedsResponse>(
    ["FollowingFeeds", params],
    ({ pageParam = undefined }) => getFollowingFeeds({ ...params, cursor: pageParam }),
    {
      enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
