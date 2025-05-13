import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
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
  return useInfiniteQuery(
    ["UserSearch", params.keyword],
    ({ pageParam = undefined }) => getUserSearch({ ...params, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ? lastPage.nextCursor : undefined;
      },
      enabled: !!params.keyword,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
