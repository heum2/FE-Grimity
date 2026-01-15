import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putFeedsLike } from "@/api/feeds/putFeedsLike";
import { deleteFeedsLike } from "@/api/feeds/deleteFeedsLike";
import type { FeedDetailResponse } from "@grimity/dto";

interface LikeMutationParams {
  id: string;
  isLiked: boolean;
}

export const useFeedsLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: LikeMutationParams) =>
      isLiked ? deleteFeedsLike(id) : putFeedsLike(id),

    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["details", id] });
      const previousDetail = queryClient.getQueryData<FeedDetailResponse>(["details", id]);

      queryClient.setQueryData<FeedDetailResponse>(["details", id], (old) => {
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
        queryClient.setQueryData(["details", id], context.previousDetail);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["details", id] });
      queryClient.invalidateQueries({ queryKey: ["feedsLatest"] });
      queryClient.invalidateQueries({ queryKey: ["FollowingFeeds"] });
      queryClient.invalidateQueries({ queryKey: ["MyLikeList"] });
      queryClient.invalidateQueries({ queryKey: ["Rankings"] });
    },
  });
};
