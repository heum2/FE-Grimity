import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PostsDetailsResponse {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
  title: string;
  content: string;
  thumbnail: string | null;
  commentCount: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  isLike: boolean;
  isSave: boolean;
}

export async function getPostsDetails(id: string): Promise<PostsDetailsResponse> {
  try {
    const response = await BASE_URL.get(`/posts/${id}`, {
      params: { id },
    });

    const post = response.data;

    const updatedData = {
      ...post,
      thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching Postsdetails:", error);
    throw new Error("Failed to fetch Postsdetails");
  }
}

export function usePostsDetails(id: string) {
  return useQuery<PostsDetailsResponse>(["Postsdetails", id], () => getPostsDetails(id), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
