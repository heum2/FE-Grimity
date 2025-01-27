import BASE_URL from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { Feed } from "../feeds/getTodayPopular";

export interface MyLikeListRequest {
  size?: number;
  cursor?: string;
}

export interface MyLikeListResponse {
  nextCursor: string | null;
  feeds: Feed[];
}

export async function getMyLikeList({
  size,
  cursor,
}: MyLikeListRequest): Promise<MyLikeListResponse> {
  try {
    const response = await BASE_URL.get("/users/me/like-feeds", { params: { size, cursor } });

    const updatedData: MyLikeListResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: Feed) => ({
        ...feed,
        cards: feed.cards.map((card) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyLikeList:", error);
    throw new Error("Failed to fetch MyLikeList");
  }
}

export function useMyLikeList({ size }: MyLikeListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyLikeListResponse>(
    "MyLikeList",
    ({ pageParam = null }) => getMyLikeList({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    }
  );
}
