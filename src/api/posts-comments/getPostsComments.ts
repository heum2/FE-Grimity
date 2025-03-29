import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import type { ParentPostCommentResponse } from "@grimity/dto";
export type { ParentPostCommentResponse };

export interface PostsCommentsRequest {
  postId: string;
}

export interface PostsCommentsResponse {
  commentCount: number;
  comments: ParentPostCommentResponse[];
}

export async function getPostsComments({
  postId,
}: PostsCommentsRequest): Promise<PostsCommentsResponse> {
  try {
    const response = await axiosInstance.get<ParentPostCommentResponse[]>("/post-comments", {
      params: { postId },
    });

    return {
      commentCount: response.data.length,
      comments: response.data,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetPostsComments({ postId }: PostsCommentsRequest) {
  return useQuery<PostsCommentsResponse>(
    ["getPostsComments", postId],
    () => getPostsComments({ postId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
