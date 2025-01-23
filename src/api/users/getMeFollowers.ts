import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface MyFollowerResponse {
  id: string;
  name: string;
  image: string;
  followerCount: number;
  isFollowing: boolean;
}

export async function getMyFollower(): Promise<MyFollowerResponse[]> {
  try {
    const response = await BASE_URL.get("/users/me/followers");

    const updatedData = response.data.map((follower: MyFollowerResponse) => ({
      ...follower,
      image: `https://image.grimity.com/${follower.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyFollowers:", error);
    throw new Error("Failed to fetch MyFollowers");
  }
}

export function useMyFollower() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyFollowerResponse[]>("myFollowers", getMyFollower, {
    enabled: Boolean(accessToken),
  });
}
