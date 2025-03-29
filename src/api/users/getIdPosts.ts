import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { MyPostResponse } from "@grimity/dto";

export interface UserPostsRequest {
  id: string;
  size?: number;
  page?: number;
}

export async function getUserPosts({
  id,
  size = 10,
  page = 1,
}: UserPostsRequest): Promise<MyPostResponse[]> {
  try {
    const response = await axiosInstance.get(`/users/${id}/posts`, {
      params: {
        size,
        page,
      },
    });

    return response.data;
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
