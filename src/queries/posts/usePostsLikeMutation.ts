import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putPostsLike } from "@/api/posts/putPostsLike";
import { deletePostsLike } from "@/api/posts/deletePostsLike";
import type { PostDetailResponse } from "@grimity/dto";

interface LikeMutationParams {
  id: string;
  isLiked: boolean;
}

export const usePostsLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: LikeMutationParams) =>
      isLiked ? deletePostsLike(id) : putPostsLike(id),

    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["Postsdetails", id] });
      const previousDetail = queryClient.getQueryData<PostDetailResponse>(["Postsdetails", id]);

      queryClient.setQueryData<PostDetailResponse>(["Postsdetails", id], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLike: !isLiked,
          likeCount: isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previousDetail };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["Postsdetails", id], context.previousDetail);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["Postsdetails", id] });
      queryClient.invalidateQueries({ queryKey: ["postsLatest"] });
    },
  });
};
