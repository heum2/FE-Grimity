import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface TodayPopularPostsResponse {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
  title: string;
  content: string;
  hasImage?: boolean;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export async function getTodayPopularPosts(): Promise<TodayPopularPostsResponse[]> {
  try {
    const response = await BASE_URL.get("/posts/today-popular");

    return response.data;
  } catch (error) {
    console.error("Error fetching TodayPopularPosts:", error);
    throw new Error("Failed to fetch TodayPopularPosts");
  }
}

export function useTodayPopularPosts() {
  return useQuery<TodayPopularPostsResponse[]>(
    ["TodayPopularPosts"],
    () => getTodayPopularPosts(),
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  );
}
