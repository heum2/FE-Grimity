import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FollowingFeedsRequest {
  size?: number;
  cursor?: string;
}

export interface FollowingFeed {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isLike: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
}

export interface FollowingFeedsResponse {
  nextCursor: string | null;
  feeds: FollowingFeed[];
}

export async function getFollowingFeeds({
  size,
  cursor,
}: FollowingFeedsRequest): Promise<FollowingFeedsResponse> {
  try {
    const response = await BASE_URL.get("/feeds/following", { params: { size, cursor } });

    const updatedData: FollowingFeedsResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FollowingFeed) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching FollowingFeeds:", error);
    throw new Error("Failed to fetch FollowingFeeds");
  }
}

export function useFollowingFeeds(params: FollowingFeedsRequest) {
  return useQuery<FollowingFeedsResponse>(["FollowingFeeds", params.cursor, params.size], () =>
    getFollowingFeeds(params)
  );
}
