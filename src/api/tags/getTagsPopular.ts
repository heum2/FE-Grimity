import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import type { PopularTagResponse } from "@grimity/dto";
export type { PopularTagResponse };

export async function getTagsPopular(): Promise<PopularTagResponse[]> {
  try {
    const response = await axiosInstance.get("/tags/popular");

    return response.data;
  } catch (error) {
    console.error("Error fetching TagsPopular:", error);
    throw new Error("Failed to fetch TagsPopular");
  }
}

export function useTagsPopular() {
  return useQuery<PopularTagResponse[]>(["TagsPopular"], getTagsPopular, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
