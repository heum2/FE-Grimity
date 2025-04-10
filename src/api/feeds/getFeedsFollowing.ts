import axiosInstance from "@/constants/baseurl";
import { useAuthStore } from "@/states/authState";
import { useInfiniteQuery, useQuery } from "react-query";
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

export function useFollowingNew(params: FollowingFeedsRequest) {
  return useQuery<FollowingFeedsResponse>(
    ["FollowingFeedsNew", params.cursor, params.size],
    () => getFollowingFeeds(params),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}

export function useFollowingFeeds(params: FollowingFeedsRequest | null) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<FollowingFeedsResponse>(
    ["FollowingFeeds", params?.size],
    ({ pageParam = undefined }) => getFollowingFeeds({ ...params, cursor: pageParam }),
    {
      enabled: !!params && isLoggedIn && Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
