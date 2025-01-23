import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FeedsCommentsRequest {
  feedId: string;
}

export interface FeedsCommentsResponse {
  commentCount: number;
  comments: {
    id: string;
    parentId: string | null;
    content: string;
    createdAt: string;
    writer: {
      id: string;
      name: string;
      image: string;
    };
    childComments: {
      id: string;
      parentId: string;
      content: string;
      createdAt: string;
      writer: {
        id: string;
        name: string;
        image: string;
      };
    }[];
  }[];
}

export async function getFeedsComments({
  feedId,
}: FeedsCommentsRequest): Promise<FeedsCommentsResponse> {
  try {
    const response = await BASE_URL.get<FeedsCommentsResponse>("/feed-comments", {
      params: { feedId },
    });

    const data = response.data;

    return {
      ...data,
      comments: data.comments.map((comment) => ({
        ...comment,
        writer: {
          ...comment.writer,
          image: `https://image.grimity.com/${comment.writer.image}`,
        },
        childComments: comment.childComments.map((child) => ({
          ...child,
          writer: {
            ...child.writer,
            image: `https://image.grimity.com/${child.writer.image}`,
          },
        })),
      })),
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetFeedsComments({ feedId }: FeedsCommentsRequest) {
  return useQuery<FeedsCommentsResponse>(["getFeedsComments", feedId], () =>
    getFeedsComments({ feedId })
  );
}
