import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { MyLikeFeedsResponse } from "@grimity/dto";

export interface MyLikeListRequest {
  size?: number;
  cursor?: string;
}

export interface MyLikeListFeed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export async function getMyLikeList({
  size,
  cursor,
}: MyLikeListRequest): Promise<MyLikeFeedsResponse> {
  try {
    const response = await axiosInstance.get("/users/me/like-feeds", { params: { size, cursor } });

    return response.data;
  } catch (error) {
    console.error("Error fetching MyLikeList:", error);
    throw new Error("Failed to fetch MyLikeList");
  }
}

export function useMyLikeList({ size }: MyLikeListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyLikeFeedsResponse>(
    "MyLikeList",
    ({ pageParam = null }) => getMyLikeList({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
