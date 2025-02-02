import BASE_URL from "@/constants/baseurl";
import { useMutation } from "react-query";

export interface FeedsCommentsPostRequest {
  feedId: string;
  parentCommentId?: string;
  content: string;
  mentionedUserId?: {};
}

export async function postFeedsComments({
  feedId,
  parentCommentId,
  content,
  mentionedUserId,
}: FeedsCommentsPostRequest): Promise<void> {
  try {
    await BASE_URL.post("/feed-comments", {
      feedId,
      parentCommentId,
      content,
      mentionedUserId,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    throw new Error("Failed to post comment");
  }
}

export function usePostFeedsComments() {
  return useMutation((data: FeedsCommentsPostRequest) => postFeedsComments(data));
}
