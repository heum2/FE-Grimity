import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchedUsersResponse } from "@grimity/dto";

export interface UserSearchRequest {
  size?: number;
  cursor?: string;
  keyword: string;
}

export async function getUserSearch({
  size,
  cursor,
  keyword,
}: UserSearchRequest): Promise<SearchedUsersResponse> {
  try {
    const response = await axiosInstance.get("/users/search", {
      params: {
        size,
        cursor,
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching UserSearch:", error);
    throw new Error("Failed to fetch UserSearch");
  }
}

export function useUserSearch(params: UserSearchRequest) {
  return useInfiniteQuery<SearchedUsersResponse>({
    queryKey: ["UserSearch", params.keyword],
    queryFn: ({ pageParam }) =>
      getUserSearch({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    enabled: !!params.keyword,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
