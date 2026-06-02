import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SearchedUsersResponse } from "@grimity/dto";

import axiosInstance from "@/constants/baseurl";

interface PutFollowParams {
  id: string;
}

export interface UserSearchInfiniteData {
  pages: SearchedUsersResponse[];
  pageParams: unknown[];
}

export async function putFollow({ id }: PutFollowParams): Promise<void> {
  await axiosInstance.put(`/users/${id}/follow`, {
    id,
  });
  return;
}

export const usePutFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putFollow,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["UserSearch"] });

      const previousSearches = queryClient.getQueriesData<UserSearchInfiniteData>({
        queryKey: ["UserSearch"],
      });

      queryClient.setQueriesData<UserSearchInfiniteData>(
        { queryKey: ["UserSearch"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              users: page.users.map((user) =>
                user.id === id
                  ? { ...user, isFollowing: true, followerCount: user.followerCount + 1 }
                  : user,
              ),
            })),
          };
        },
      );

      return { previousSearches };
    },
    onError: (_err, _vars, context) => {
      context?.previousSearches?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myFollowings"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["UserSearch"] });
    },
  });
};
