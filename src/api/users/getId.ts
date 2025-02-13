import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface UserInfoRequest {
  id: string;
}

export interface UserInfoResponse {
  id: string;
  name: string;
  image: string;
  backgroundImage: string;
  description: string;
  links: { linkName: string; link: string }[];
  followerCount: number;
  followingCount: number;
  feedCount: number;
  postCount: number;
  isFollowing: boolean;
}

export async function getUserInfo({ id }: UserInfoRequest): Promise<UserInfoResponse> {
  try {
    const response = await BASE_URL.get(`/users/${id}`);

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;
    updatedData.backgroundImage = `https://image.grimity.com/${updatedData.backgroundImage}`;

    return updatedData;
  } catch (error) {
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export const useUserData = (userId: string | null) => {
  return useQuery(["userData", userId], () => getUserInfo({ id: userId! }), {
    enabled: Boolean(userId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
