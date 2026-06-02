import axiosInstance from "@/constants/baseurl";
import { useQuery } from "@tanstack/react-query";
import { MySavePostsResponse } from "@grimity/dto";

import { useAuthStore } from "@/states/authStore";
import { useShallow } from "zustand/react/shallow";

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
  const { isAuthReady, isLoggedIn } = useAuthStore(
    useShallow((state) => ({
      isAuthReady: state.isAuthReady,
      isLoggedIn: state.isLoggedIn,
    })),
  );
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
