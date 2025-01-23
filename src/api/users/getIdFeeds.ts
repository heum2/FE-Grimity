import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface UserFeedsRequest {
  id: string;
  size?: number;
  sort?: "latest" | "like" | "view" | "oldest";
  index?: number;
}

export interface UserFeedsResponse {
  id: string;
  title: string;
  cards: string[];
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export async function getUserFeeds({
  id,
  size,
  sort,
  index,
}: UserFeedsRequest): Promise<UserFeedsResponse[]> {
  try {
    const response = await BASE_URL.get(`/users/${id}/feeds`, {
      params: {
        sort,
        index,
        size: size,
      },
    });

    const updatedData = response.data.map((data: UserFeedsResponse) => ({
      ...data,
      cards: data.cards.map((card) => `https://image.grimity.com/${card}`),
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching User Feeds:", error);
    throw new Error("Failed to fetch User Feeds");
  }
}

export function useUserFeeds({ id, sort, index, size }: UserFeedsRequest) {
  return useQuery<UserFeedsResponse[]>(["userFeeds", id, sort, index, size], () =>
    getUserFeeds({ id, sort, index, size })
  );
}
