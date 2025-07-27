import { postFeeds } from "@/api/feeds/postFeeds";
import Button from "@/components/Button/Button";
import styles from "@/components/Modal/Modal.module.scss";
import { useToast } from "@/hooks/useToast";
import { CreateFeedRequest } from "@grimity/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUrl as imageDomain } from "@/constants/imageUrl";
import { AxiosError } from "axios";
import { putEditFeeds } from "@/api/feeds/putFeedsId";
import { useModal } from "@/hooks/useModal";
import UploadModal from "@/components/Modal/Upload/Upload";
import { useRouter } from "next/router";

interface FeedConfirmProps {
  id?: string;
  data: CreateFeedRequest;
  isEditMode: boolean;
  onSuccessCallback?: () => void;
  close: () => void;
}

const FeedConfirm = ({ id, data, isEditMode, onSuccessCallback, close }: FeedConfirmProps) => {
  const router = useRouter();

  const { showToast } = useToast();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { mutate: uploadFeed, isPending: isUploadPending } = useMutation({
    mutationFn: postFeeds,
    onSuccess: (response, variables) => {
      if (!response.id) {
        showToast("업로드 중 문제가 발생했습니다. 다시 시도해주세요.", "error");
        return;
      }
      onSuccessCallback?.();
      const imageUrl = `${imageDomain}/${variables.thumbnail}`;
      close();

      openModal((closeUploadModal) => (
        <UploadModal
          feedId={response.id}
          title={variables.title}
          image={imageUrl}
          close={closeUploadModal}
        />
      ));
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
          return;
        }
      }
      showToast("업로드 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    },
  });

  const { mutate: editFeed, isPending: isEditPending } = useMutation({
    mutationFn: putEditFeeds,
    onSuccess: () => {
      onSuccessCallback?.();
      showToast("수정이 완료되었습니다!", "success");
      queryClient.invalidateQueries({ queryKey: ["feeds", id] });
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      router.push(`/feeds/${id}`);
      close();
    },
    onError: (error: AxiosError) => {
      showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
      }
    },
  });

  const handleSubmit = () => {
    if (isEditMode && id) {
      editFeed({ id, data });
    } else {
      uploadFeed(data);
    }
  };

  return (
    <div className={styles.comfirmModal}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>그림을 {isEditMode ? "수정" : "업로드"}할까요?</h2>
      </div>
      <div className={styles.btnsContainer}>
        <Button size="l" type="outlined-assistive" onClick={close}>
          취소
        </Button>
        <Button
          size="l"
          type="filled-primary"
          onClick={handleSubmit}
          disabled={isUploadPending || isEditPending}
        >
          {isEditMode ? "수정" : "업로드"}
        </Button>
      </div>
    </div>
  );
};

export default FeedConfirm;
