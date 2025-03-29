import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { TodayPopularFeedResponse } from "@grimity/dto";

export async function getTodayFeedPopular(): Promise<TodayPopularFeedResponse[]> {
  try {
    const response = await axiosInstance.get("/feeds/today-popular");

    return response.data;
  } catch (error) {
    console.error("Error fetching TodayFeedPopular:", error);
    throw new Error("Failed to fetch TodayFeedPopular");
  }
}

export function useTodayFeedPopular() {
  return useQuery<TodayPopularFeedResponse[]>(["TodayFeedPopular"], getTodayFeedPopular, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
