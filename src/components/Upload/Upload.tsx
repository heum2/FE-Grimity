import { useRef } from "react";
import router from "next/router";

import { useMutation } from "react-query";
import { AxiosError } from "axios";

import { CreateFeedRequest, IdResponse, postFeeds } from "@/api/feeds/postFeeds";

import { useModalStore } from "@/states/modalStore";

import FeedForm from "@/components/Upload/FeedForm/FeedForm";

import { imageUrl as imageDomain } from "@/constants/imageUrl";

import { useToast } from "@/hooks/useToast";

export default function Upload() {
  const openModal = useModalStore((state) => state.openModal);
  const { showToast } = useToast();
  const hasUnsavedChangesRef = useRef(false);

  const { mutate: uploadFeed, isLoading } = useMutation<IdResponse, AxiosError, CreateFeedRequest>(
    postFeeds,
    {
      onSuccess: (response: IdResponse, variables) => {
        hasUnsavedChangesRef.current = false;
        if (!response.id) {
          showToast("업로드 중 문제가 발생했습니다. 다시 시도해주세요.", "error");
          return;
        }

        const imageUrl = `${imageDomain}/${variables.thumbnail}`;
        openModal({
          type: "UPLOAD",
          data: { feedId: response.id, title: variables.title, image: imageUrl },
        });
        router.push(`/feeds/${response.id}`);
      },
      onError: (error: AxiosError) => {
        showToast("업로드 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
        if (error.response?.status === 400) {
          showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
        }
      },
    },
  );

  const handleSubmit = (data: CreateFeedRequest) => {
    uploadFeed(data);
  };

  return <FeedForm isEditMode={false} onSubmit={handleSubmit} isLoading={isLoading} />;
}
