import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MyLikeFeedsResponse } from "@grimity/dto";

export interface MySaveListRequest {
  size?: number;
  cursor?: string;
}

export async function getMySaveList({
  size,
  cursor,
}: MySaveListRequest): Promise<MyLikeFeedsResponse> {
  try {
    const response = await axiosInstance.get("/me/save-feeds", { params: { size, cursor } });

    return response.data;
  } catch (error) {
    console.error("Error fetching MySaveList:", error);
    throw new Error("Failed to fetch MySaveList");
  }
}

export function useMySaveList({ size }: MySaveListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyLikeFeedsResponse>({
    queryKey: ["MySaveList"],
    queryFn: ({ pageParam }) => getMySaveList({ cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    enabled: Boolean(accessToken),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
