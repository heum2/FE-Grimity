import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";
import { Feed } from "../feeds/getTodayPopular";

export interface UserFeedsRequest {
  id: string;
  size?: number;
  sort?: "latest" | "like" | "oldest";
  cursor?: string;
}

export interface UserFeedsResponse {
  nextCursor: string | null;
  feeds: Feed[];
}

export async function getUserFeeds({
  id,
  size,
  sort = "latest",
  cursor,
}: UserFeedsRequest): Promise<UserFeedsResponse> {
  try {
    const response = await BASE_URL.get(`/users/${id}/feeds`, {
      params: {
        sort,
        cursor,
        size,
      },
    });

    const updatedData: UserFeedsResponse = {
      nextCursor: response.data.nextCursor,
      feeds: response.data.feeds.map((feed: Feed) => ({
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

export function useUserFeeds({ id, sort, cursor, size }: UserFeedsRequest) {
  return useQuery<UserFeedsResponse>(["userFeeds", id, sort, cursor, size], () =>
    getUserFeeds({ id, sort, cursor, size })
  );
}
