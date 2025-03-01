import axiosInstance from "@/constants/baseurl";
import { useMutation } from "react-query";

export interface PostsCommentsPostRequest {
  postId: string;
  parentCommentId?: string;
  content: string;
  mentionedUserId?: {};
}

export async function postPostsComments({
  postId,
  parentCommentId,
  content,
  mentionedUserId,
}: PostsCommentsPostRequest): Promise<void> {
  try {
    await axiosInstance.post("/post-comments", {
      postId,
      parentCommentId,
      content,
      mentionedUserId,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    throw new Error("Failed to post comment");
  }
}

export function usePostPostsComments() {
  return useMutation((data: PostsCommentsPostRequest) => postPostsComments(data));
}
