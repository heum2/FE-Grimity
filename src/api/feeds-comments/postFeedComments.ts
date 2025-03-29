import axiosInstance from "@/constants/baseurl";
import { useMutation } from "react-query";
import { CreateFeedCommentRequest } from "@grimity/dto";

export async function postFeedsComments({
  feedId,
  parentCommentId,
  content,
  mentionedUserId,
}: CreateFeedCommentRequest): Promise<void> {
  try {
    await axiosInstance.post("/feed-comments", {
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
  return useMutation((data: CreateFeedCommentRequest) => postFeedsComments(data));
}
