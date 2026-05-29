import axiosInstance from "@/constants/baseurl";
import { useQuery } from "@tanstack/react-query";
import { MySavePostsResponse } from "@grimity/dto";

import { useAuthStore } from "@/states/authStore";

export interface MySavePostRequest {
  size?: number;
  page?: number;
}

export async function getMySavePost({
  size,
  page,
}: MySavePostRequest): Promise<MySavePostsResponse> {
  try {
    const response = await axiosInstance.get("/me/save-posts", { params: { size, page } });

    return response.data;
  } catch (error) {
    console.error("Error fetching MySavePost:", error);
    throw new Error("Failed to fetch MySavePost");
  }
}

export function useMySavePost({ size, page }: MySavePostRequest, options?: { enabled?: boolean }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const enabled = options?.enabled ?? (isAuthReady && isLoggedIn);

  return useQuery<MySavePostsResponse>({
    queryKey: ["MySavePost", size, page],
    queryFn: () => getMySavePost({ size, page }),
    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
