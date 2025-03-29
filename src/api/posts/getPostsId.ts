import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "react-query";
import type { PostDetailResponse, PostBaseResponse } from "@grimity/dto";
export type { PostBaseResponse };
import { baseUrl } from "@/constants/baseurl";

export async function getPostsDetails(id: string): Promise<PostDetailResponse> {
  try {
    const response = await axiosInstance.get(`/posts/${id}`, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Postsdetails:", error);
    throw new Error("Failed to fetch Postsdetails");
  }
}

export async function getSSRPostsDetails(id: string): Promise<PostBaseResponse> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await axios.get(`${baseUrl}/posts/${id}/meta`, {
      params: { id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("DELETED_POST");
    }
    console.error("Error fetching Postsdetails:", error);
    throw new Error("Failed to fetch Postsdetails");
  }
}

export function usePostsDetails(id: string) {
  return useQuery<PostDetailResponse>(["Postsdetails", id], () => getPostsDetails(id), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
