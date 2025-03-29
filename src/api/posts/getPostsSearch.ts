import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { PostsResponse } from "@grimity/dto";

export interface PostSearchRequest {
  searchBy: "combined" | "name";
  size?: number;
  page?: number;
  keyword: string;
}

export async function getPostSearch({
  searchBy,
  size,
  page,
  keyword,
}: PostSearchRequest): Promise<PostsResponse> {
  try {
    const response = await axiosInstance.get("/posts/search", {
      params: {
        searchBy,
        size,
        page,
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching PostSearch:", error);
    throw new Error("Failed to fetch PostSearch");
  }
}

export function usePostSearch(params: PostSearchRequest | null) {
  return useQuery<PostsResponse>(
    params ? ["PostSearch", params.searchBy, params.size, params.page, params.keyword] : [],
    () => (params ? getPostSearch(params) : Promise.reject(undefined)),
    {
      enabled: !!params,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
