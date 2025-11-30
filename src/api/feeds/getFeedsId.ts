import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/constants/baseurl";
import type { FeedDetailResponse, FeedMetaResponse } from "@grimity/dto";
export type { FeedMetaResponse };

export async function getDetails(id: string): Promise<FeedDetailResponse> {
  try {
    const response = await axiosInstance.get(`/feeds/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_FEED");
      }
    }
    console.error("Error fetching details:", error);
    throw error;
  }
}

export async function getSSRDetails(id: string): Promise<FeedMetaResponse> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await axios.get(`${baseUrl}/feeds/${id}/meta`, {
      params: { id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("DELETED_FEED");
    }
    console.error("Error fetching details:", error);
    throw error;
  }
}

export function useDetails(id?: string) {
  return useQuery<FeedDetailResponse>({
    queryKey: ["details", id],
    queryFn: () => getDetails(id!),
    enabled: !!id,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
