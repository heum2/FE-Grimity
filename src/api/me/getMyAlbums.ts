import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/states/authStore";
import axiosInstance from "@/constants/baseurl";
import { AlbumBaseResponse } from "@grimity/dto";
import axios from "axios";
export type { AlbumBaseResponse };

export async function getMyAlbums(): Promise<AlbumBaseResponse[]> {
  try {
    const response = await axiosInstance.get<AlbumBaseResponse[]>("/me/albums");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to get my albums");
  }
}

export function useMyAlbums() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<AlbumBaseResponse[]>({
    queryKey: ["myAlbums"],
    queryFn: getMyAlbums,
    enabled: isLoggedIn && Boolean(accessToken),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
