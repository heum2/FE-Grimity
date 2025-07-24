import axiosInstance from "@/constants/baseurl";
import { useMutation } from "@tanstack/react-query";
import { CreatePostCommentRequest } from "@grimity/dto";

export async function postPostsComments({
  postId,
  parentCommentId,
  content,
  mentionedUserId,
}: CreatePostCommentRequest): Promise<void> {
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
  return useMutation({
    mutationFn: (data: CreatePostCommentRequest) => postPostsComments(data),
  });
}
