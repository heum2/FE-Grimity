import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery, useQuery } from "react-query";
import { UserFeedsResponse } from "@grimity/dto";

export interface UserFeedsRequest {
  id: string;
  size?: number;
  sort?: "latest" | "like" | "oldest";
  cursor?: string;
}

export async function getUserFeeds({
  id,
  size,
  sort = "latest",
  cursor,
}: UserFeedsRequest): Promise<UserFeedsResponse> {
  try {
    const response = await axiosInstance.get<UserFeedsResponse>(`/users/${id}/feeds`, {
      params: {
        sort,
        cursor,
        size,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching User Feeds:", error);
    throw new Error("Failed to fetch User Feeds");
  }
}

export function useUserForDetail({ id, sort, cursor, size }: UserFeedsRequest) {
  return useQuery<UserFeedsResponse>(
    ["userFeeds", id, sort, cursor, size],
    () => getUserFeeds({ id, sort, cursor, size }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}

export function useUserFeeds(params: UserFeedsRequest) {
  return useInfiniteQuery<UserFeedsResponse>(
    ["userFeeds", params.id, params.sort, params.size],
    ({ pageParam = undefined }) =>
      getUserFeeds({
        ...params,
        cursor: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ? lastPage.nextCursor : undefined;
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
