import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import type { FeedCommentsResponse, FeedChildCommentResponse } from "@grimity/dto";
export type { FeedCommentsResponse };

/* 댓글 api */
export interface FeedsCommentsRequest {
  feedId: string;
  enabled?: boolean;
}

export async function getFeedsComments({
  feedId,
}: FeedsCommentsRequest): Promise<FeedCommentsResponse> {
  try {
    const response = await axiosInstance.get<FeedCommentsResponse>("/feed-comments", {
      params: { feedId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetFeedsComments({ feedId, enabled = true }: FeedsCommentsRequest) {
  return useQuery<FeedCommentsResponse>(
    ["getFeedsComments", feedId],
    () => getFeedsComments({ feedId }),
    {
      enabled: enabled,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}

/* 답글 api */
export interface FeedsChildCommentsRequest {
  feedId: string;
  parentId: string;
}

export async function getFeedsChildComments({
  feedId,
  parentId,
}: FeedsChildCommentsRequest): Promise<FeedChildCommentResponse[]> {
  try {
    const response = await axiosInstance.get<FeedChildCommentResponse[]>(
      "/feed-comments/child-comments",
      {
        params: { feedId, parentId },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching child comments:", error);
    throw new Error("Failed to fetch child comments");
  }
}

export function useGetFeedsChildComments({ feedId, parentId }: FeedsChildCommentsRequest) {
  return useQuery<FeedChildCommentResponse[]>(
    ["getFeedsChildComments", feedId, parentId],
    () => getFeedsChildComments({ feedId, parentId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
