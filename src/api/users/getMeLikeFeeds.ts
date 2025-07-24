import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "@tanstack/react-query";
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
    const response = await axiosInstance.get("/me/like-feeds", { params: { size, cursor } });

    return response.data;
  } catch (error) {
    console.error("Error fetching MyLikeList:", error);
    throw new Error("Failed to fetch MyLikeList");
  }
}

export function useMyLikeList({ size }: MyLikeListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyLikeFeedsResponse>({
    queryKey: ["MyLikeList"],
    queryFn: ({ pageParam }) => getMyLikeList({ cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    enabled: Boolean(accessToken),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
