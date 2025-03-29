import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import type { PostResponse } from "@grimity/dto";
export type { PostResponse };

export async function getTodayPopularPosts(): Promise<PostResponse[]> {
  try {
    const response = await axiosInstance.get("/posts/today-popular");

    return response.data;
  } catch (error) {
    console.error("Error fetching TodayPopularPosts:", error);
    throw new Error("Failed to fetch TodayPopularPosts");
  }
}

export function useTodayPopularPosts() {
  return useQuery<PostResponse[]>(["TodayPopularPosts"], () => getTodayPopularPosts(), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
