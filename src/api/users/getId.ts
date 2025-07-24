import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileResponse, UserMetaResponse } from "@grimity/dto";
export type { UserMetaResponse };
import { baseUrl } from "@/constants/baseurl";

export interface UserInfoRequest {
  id: string;
}

export interface UserInfoRequestByURL {
  url: string;
}

export async function getUserInfo({ id }: UserInfoRequest): Promise<UserProfileResponse> {
  try {
    const response = await axiosInstance.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export async function getUserInfoByUrl({
  url,
}: UserInfoRequestByURL): Promise<UserProfileResponse> {
  try {
    const response = await axiosInstance.get(`/users/profile/${url}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export async function getSSRUserInfoByUrl(url: string): Promise<UserMetaResponse> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await axios.get(`${baseUrl}/users/profile/${url}/meta`, {
      params: { url },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export const useUserData = (userId: string | null) => {
  return useQuery({
    queryKey: ["userData", userId],
    queryFn: () => getUserInfo({ id: userId! }),
    enabled: Boolean(userId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useUserDataByUrl = (url: string | null) => {
  return useQuery({
    queryKey: ["userData", url],
    queryFn: () => getUserInfoByUrl({ url: url! }),
    enabled: Boolean(url),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
