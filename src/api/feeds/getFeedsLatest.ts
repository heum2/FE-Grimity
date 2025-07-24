import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LatestFeedsResponse } from "@grimity/dto";

export interface FeedsLatestRequest {
  size?: number;
  cursor?: string;
}

export async function getFeedsLatest({
  size,
  cursor,
}: FeedsLatestRequest): Promise<LatestFeedsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/latest", {
      params: { size, cursor },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching FeedsLatest:", error);
    throw new Error("Failed to fetch FeedsLatest");
  }
}

export function useFeedsLatest({ size }: FeedsLatestRequest) {
  return useInfiniteQuery<LatestFeedsResponse>({
    queryKey: ["feedsLatest"],
    queryFn: ({ pageParam }) => getFeedsLatest({ size, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
