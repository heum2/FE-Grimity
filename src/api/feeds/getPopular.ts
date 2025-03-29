import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { PopularFeedsResponse } from "@grimity/dto";

export async function getPopularFeed({ pageParam = null }): Promise<PopularFeedsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/popular", {
      params: {
        cursor: pageParam,
        size: 30,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopularFeed() {
  return useInfiniteQuery<PopularFeedsResponse>("PopularFeed", getPopularFeed, {
    getNextPageParam: (lastPage) => {
      // sourcery skip: simplify-ternary
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
