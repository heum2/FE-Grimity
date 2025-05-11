import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { MyFollowersResponse, MyFollowingsResponse } from "@grimity/dto";

/* 팔로워 목록 */
export interface MyFollowerRequest {
  size?: number;
  cursor?: string;
}

export async function getMyFollower({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowersResponse> {
  try {
    const response = await axiosInstance.get("/me/followers", {
      params: { size, cursor },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching MyFollowers:", error);
    throw new Error("Failed to fetch MyFollowers");
  }
}

export function useMyFollower({ size }: MyFollowerRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowersResponse>(
    "myFollowers",
    ({ pageParam = undefined }) => getMyFollower({ size, cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
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

/* 팔로잉 목록 */

export async function getMyFollowing({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowingsResponse> {
  try {
    const response = await axiosInstance.get("/me/followings", {
      params: { size, cursor },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching MyFollowings:", error);
    throw new Error("Failed to fetch MyFollowings");
  }
}

export function useMyFollowing({ size }: MyFollowerRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowingsResponse>(
    "myFollowings",
    ({ pageParam = undefined }) => getMyFollowing({ size, cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
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
