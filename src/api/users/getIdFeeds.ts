import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery, useQuery } from "react-query";

export interface UserFeedsRequest {
  id: string;
  size?: number;
  sort?: "latest" | "like" | "oldest";
  cursor?: string;
}

export interface UserFeeds {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface UserFeedsResponse {
  nextCursor: string | null;
  feeds: UserFeeds[];
}

export async function getUserFeeds({
  id,
  size,
  sort = "latest",
  cursor,
}: UserFeedsRequest): Promise<UserFeedsResponse> {
  try {
    const response = await axiosInstance.get(`/users/${id}/feeds`, {
      params: {
        sort,
        cursor,
        size,
      },
    });

    const updatedData: UserFeedsResponse = {
      nextCursor: response.data.nextCursor,
      feeds: response.data.feeds.map((feed: UserFeeds) => ({
        ...feed,
        cards: feed.cards.map((card: string) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
      })),
    };

    return updatedData;
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
