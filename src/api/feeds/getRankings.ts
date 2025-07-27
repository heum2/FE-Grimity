import axiosInstance from "@/constants/baseurl";
import { useQuery } from "@tanstack/react-query";
import { FeedRankingsResponse, GetRankingsRequest } from "@grimity/dto";

export async function getRankings(params: GetRankingsRequest): Promise<FeedRankingsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/rankings", {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function useRankings(params: GetRankingsRequest) {
  return useQuery<FeedRankingsResponse>({
    queryKey: ["Rankings", params],
    queryFn: () => getRankings(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
