import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface TagsPopularResponse {
  tagName: string;
  thumbnail: string;
}

export async function getTagsPopular(): Promise<TagsPopularResponse[]> {
  try {
    const response = await BASE_URL.get("/tags/popular");

    const updatedData = response.data.map((tag: TagsPopularResponse) => ({
      ...tag,
      thumbnail: `https://image.grimity.com/${tag.thumbnail}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching TagsPopular:", error);
    throw new Error("Failed to fetch TagsPopular");
  }
}

export function useTagsPopular() {
  return useQuery<TagsPopularResponse[]>(["TagsPopular"], getTagsPopular, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
