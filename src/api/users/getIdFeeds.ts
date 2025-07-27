import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { UserFeedsResponse } from "@grimity/dto";

export interface UserFeedsRequest {
  id: string;
  size?: number;
  sort?: "latest" | "like" | "oldest";
  cursor?: string;
  albumId?: string | null;
}

export async function getUserFeeds({
  id,
  size,
  sort = "latest",
  cursor,
  albumId,
}: UserFeedsRequest): Promise<UserFeedsResponse> {
  try {
    const response = await axiosInstance.get<UserFeedsResponse>(`/users/${id}/feeds`, {
      params: {
        sort,
        cursor,
        size,
        albumId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching User Feeds:", error);
    throw new Error("Failed to fetch User Feeds");
  }
}

export function useUserForDetail({ id, sort, cursor, size }: UserFeedsRequest) {
  return useQuery<UserFeedsResponse>({
    queryKey: ["userFeeds", id, sort, cursor, size],
    queryFn: () => getUserFeeds({ id, sort, cursor, size }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUserFeeds(params: UserFeedsRequest) {
  const queryKey = ["userFeeds", params.id, params.sort, params.size, params.albumId || "null"];

  return useInfiniteQuery<UserFeedsResponse>({
    queryKey,
    queryFn: ({ pageParam }) =>
      getUserFeeds({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
