import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";

import type { PostDetailResponse, PostsResponse } from "@grimity/dto";

interface SaveMutationParams {
  id: string;
  isSaved: boolean;
}

type SearchPostWithSave = PostsResponse["posts"][number] & { isSave?: boolean };

export const usePostsSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isSaved }: SaveMutationParams) =>
      isSaved ? deletePostsSave(id) : putPostsSave(id),

    onMutate: async ({ id, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: ["PostSearch"] });
      await queryClient.cancelQueries({ queryKey: ["Postsdetails", id] });

      const previousSearches = queryClient.getQueriesData<PostsResponse>({
        queryKey: ["PostSearch"],
      });
      const previousDetail = queryClient.getQueryData<PostDetailResponse>(["Postsdetails", id]);

      queryClient.setQueriesData<PostsResponse>({ queryKey: ["PostSearch"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.map((post) =>
            post.id === id ? ({ ...post, isSave: !isSaved } as SearchPostWithSave) : post,
          ),
        };
      });

      queryClient.setQueryData<PostDetailResponse>(["Postsdetails", id], (old) => {
        if (!old) return old;
        return { ...old, isSave: !isSaved };
      });

      return { previousSearches, previousDetail };
    },

    onError: (_err, { id }, context) => {
      context?.previousSearches?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(["Postsdetails", id], context.previousDetail);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["Postsdetails", id] });
      queryClient.invalidateQueries({ queryKey: ["PostSearch"] });
      queryClient.invalidateQueries({ queryKey: ["MySavePost"] });
    },
  });
};
