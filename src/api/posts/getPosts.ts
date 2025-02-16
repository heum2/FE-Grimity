import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PostsLatestRequest {
  size: number;
  page: number;
  type: "ALL" | "QUESTION" | "FEEDBACK";
}

export interface PostsLatest {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
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

export interface PostsLatestResponse {
  posts: PostsLatest[];
  totalCount: number;
}

export async function getPostsLatest({
  size = 10,
  page = 1,
  type = "ALL",
}: PostsLatestRequest): Promise<PostsLatestResponse> {
  try {
    const response = await BASE_URL.get("/posts", {
      params: { size, page, type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching postsLatest:", error);
    throw new Error("Failed to fetch postsLatest");
  }
}

export const usePostsLatest = (params: PostsLatestRequest) => {
  return useQuery<PostsLatestResponse>(["postsLatest", params], () => getPostsLatest(params), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export async function getPostsNotices(): Promise<PostsLatest[]> {
  try {
    const response = await BASE_URL.get("/posts/notices");
    return response.data;
  } catch (error) {
    console.error("Error fetching postsNotices:", error);
    throw new Error("Failed to fetch postsNotices");
  }
}

export const usePostsNotices = () => {
  return useQuery<PostsLatest[]>(["postsNotices"], () => getPostsNotices(), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
