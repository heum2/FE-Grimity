import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FollowingResponse {
  id: string;
  name: string;
  image: string;
  followerCount: number;
}

export async function getFollowing(id: string): Promise<FollowingResponse[]> {
  try {
    const response = await BASE_URL.get(`/users/${id}/followings`);

    const updatedData = response.data.map((following: FollowingResponse) => ({
      ...following,
      image: `https://image.grimity.com/${following.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching Followings:", error);
    throw new Error("Failed to fetch Followings");
  }
}

export function useFollowing(id: string) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<FollowingResponse[]>(["Followings", id], () => getFollowing(id), {
    enabled: Boolean(accessToken),
  });
}
