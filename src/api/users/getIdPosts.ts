import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface UserPostsRequest {
  id: string;
  size?: number;
  page?: number;
}

export interface UserPostsResponse {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
  title: string;
  content: string;
  thumbnail: string | null;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export async function getUserPosts({
  id,
  size = 10,
  page = 1,
}: UserPostsRequest): Promise<UserPostsResponse[]> {
  try {
    const response = await BASE_URL.get(`/users/${id}/posts`, {
      params: {
        size,
        page,
      },
    });

    const updatedPosts: UserPostsResponse[] = response.data.map((post: UserPostsResponse) => ({
      ...post,
      thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
    }));

    return updatedPosts;
  } catch (error) {
    console.error("Error fetching User Posts:", error);
    throw new Error("Failed to fetch User Posts");
  }
}

export const useUserPosts = ({
  id,
  size,
  page,
  enabled = true,
}: UserPostsRequest & { enabled?: boolean }) => {
  return useQuery(["userPosts", id, size, page], () => getUserPosts({ id, size, page }), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled,
  });
};
