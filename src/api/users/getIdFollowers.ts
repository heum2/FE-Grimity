import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FollowerResponse {
  id: string;
  name: string;
  image: string;
  followerCount: number;
}

export async function getFollower(id: string): Promise<FollowerResponse[]> {
  try {
    const response = await BASE_URL.get(`/users/${id}/followers`);

    const updatedData = response.data.map((follower: FollowerResponse) => ({
      ...follower,
      image: `https://image.grimity.com/${follower.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching Followers:", error);
    throw new Error("Failed to fetch Followers");
  }
}

export function useFollower(id: string) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<FollowerResponse[]>(["Followers", id], () => getFollower(id), {
    enabled: Boolean(accessToken),
  });
}
