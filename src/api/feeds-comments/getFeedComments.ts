import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import type { ParentFeedCommentResponse } from "@grimity/dto";
export type { ParentFeedCommentResponse };

/* 댓글 api */
export interface FeedsCommentsRequest {
  feedId: string;
}

export interface FeedsCommentsResponse {
  comments: ParentFeedCommentResponse[];
}

export async function getFeedsComments({
  feedId,
}: FeedsCommentsRequest): Promise<FeedsCommentsResponse> {
  try {
    const response = await axiosInstance.get<ParentFeedCommentResponse[]>("/feed-comments", {
      params: { feedId },
    });

    return {
      comments: response.data,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetFeedsComments({ feedId }: FeedsCommentsRequest) {
  return useQuery<FeedsCommentsResponse>(
    ["getFeedsComments", feedId],
    () => getFeedsComments({ feedId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
