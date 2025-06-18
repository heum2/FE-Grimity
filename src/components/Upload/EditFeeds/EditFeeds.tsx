import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useMutation, useQueryClient } from "react-query";
import { AxiosError } from "axios";

import { useDetails } from "@/api/feeds/getFeedsId";
import { CreateFeedRequest, putEditFeeds } from "@/api/feeds/putFeedsId";

import { useAuthStore } from "@/states/authStore";

import Loader from "@/components/Layout/Loader/Loader";
import FeedForm from "@/components/Upload/FeedForm/FeedForm";

import { FeedData } from "@/components/Upload/FeedForm/FeedForm.types";

import { useToast } from "@/hooks/useToast";

interface EditFeedsProps {
  id: string;
}

export default function EditFeeds({ id }: EditFeedsProps) {
  const router = useRouter();
  const hasUnsavedChangesRef = useRef(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: feedData, isLoading: isFetching } = useDetails(id);

  useEffect(() => {
    if (isFetching) return;
    if (!isLoggedIn) {
      showToast("로그인 후 작성 가능합니다.", "warning");
      router.push("/");
    } else if (feedData && user_id !== feedData?.author.id) {
      showToast("수정 권한이 없습니다.", "error");
      router.push("/");
    }
  }, [isLoggedIn, router, user_id, feedData, showToast, isFetching]);

  const { mutate: editFeed, isLoading: isUpdating } = useMutation(
    (data: CreateFeedRequest) => putEditFeeds(id, data),
    {
      onSuccess: () => {
        hasUnsavedChangesRef.current = false;
        showToast("수정이 완료되었습니다!", "success");
        queryClient.invalidateQueries({ queryKey: ["feeds", id] });
        queryClient.invalidateQueries({ queryKey: ["feeds"] });
        router.push(`/feeds/${id}`);
      },
      onError: (error: AxiosError) => {
        showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
        if (error.response?.status === 400) {
          showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
        }
      },
    },
  );

  if (isFetching) return <Loader />;
  if (!feedData) return <div>피드 데이터를 불러오지 못했습니다.</div>;

  const initialValues: FeedData = {
    title: feedData.title,
    content: feedData.content,
    tags: feedData.tags,
    images: feedData.cards.map((name) => ({
      name,
      url: name,
      originalName: name,
    })),
    thumbnailName: feedData.thumbnail,
    thumbnailUrl: feedData.thumbnail,
    albumId: feedData.album?.id || null,
    albumName: feedData.album?.name || "",
  };

  const handleSubmit = (data: CreateFeedRequest) => {
    editFeed(data);
  };

  return (
    <FeedForm
      isEditMode={true}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  );
}
