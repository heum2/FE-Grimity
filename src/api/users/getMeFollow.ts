import BASE_URL from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

/* 팔로워 목록 */
export interface MyFollowerRequest {
  size?: number;
  cursor?: string;
}

export interface Follows {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface MyFollowerResponse {
  nextCursor: string | null;
  followers: Follows[];
}

export async function getMyFollower({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowerResponse> {
  try {
    const params: MyFollowerRequest = {
      size,
      cursor,
    };
    const response = await BASE_URL.get("/users/me/followers", { params });

    const updatedData = {
      ...response.data,
      followers: response.data.followers.map((follower: Follows) => ({
        ...follower,
        image: `https://image.grimity.com/${follower.image}`,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyFollowers:", error);
    throw new Error("Failed to fetch MyFollowers");
  }
}

export function useMyFollower() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowerResponse>(
    "myFollowers",
    ({ pageParam = null }) => getMyFollower({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

/* 팔로잉 목록 */
export interface MyFollowingResponse {
  nextCursor: string | null;
  followings: Follows[];
}

export async function getMyFollowing({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowingResponse> {
  try {
    const params: MyFollowerRequest = {
      size,
      cursor,
    };
    const response = await BASE_URL.get("/users/me/followings", { params });

    const updatedData = {
      ...response.data,
      followings: response.data.followings.map((following: Follows) => ({
        ...following,
        image: `https://image.grimity.com/${following.image}`,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyFollowings:", error);
    throw new Error("Failed to fetch MyFollowings");
  }
}

export function useMyFollowing() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowingResponse>(
    "myFollowings",
    ({ pageParam = null }) => getMyFollowing({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}
