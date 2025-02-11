import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PostSearchRequest {
  searchBy: "combined" | "name";
  size?: number;
  page?: number;
  keyword: string;
}

export interface PostSearch {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
  title: string;
  createdAt: string;
  content: string;
  hasImage?: boolean;
  viewCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string;
  };
}

export interface PostSearchResponse {
  totalCount: string | null;
  posts: PostSearch[];
}

export async function getPostSearch({
  searchBy = "combined",
  size = 10,
  page = 1,
  keyword,
}: PostSearchRequest): Promise<PostSearchResponse> {
  try {
    const response = await BASE_URL.get("/posts/search", {
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

export function usePostSearch(params: PostSearchRequest) {
  return useQuery<PostSearchResponse>(
    ["PostSearch", params.searchBy, params.size, params.page, params.keyword],
    () => getPostSearch(params),
    {}
  );
}
