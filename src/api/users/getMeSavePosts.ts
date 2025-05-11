import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { MySavePostsResponse } from "@grimity/dto";

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

export function useMySavePost({ size, page }: MySavePostRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MySavePostsResponse>(
    ["MySavePost", size, page],
    () => getMySavePost({ size, page }),
    {
      enabled: Boolean(accessToken),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
