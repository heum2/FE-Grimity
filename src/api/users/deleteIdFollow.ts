import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";
import { UserSearchInfiniteData } from "./putIdFollow";

interface DeleteFollowParams {
  id: string;
}



export async function deleteFollow({ id }: DeleteFollowParams): Promise<void> {
  await axiosInstance.delete(`/users/${id}/follow`);
  return;
}

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFollow,
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
                  ? {
                      ...user,
                      isFollowing: false,
                      followerCount: Math.max(0, user.followerCount - 1),
                    }
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
