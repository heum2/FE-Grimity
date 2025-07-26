import Button from "@/components/Button/Button";
import { useModalStore } from "@/states/modalStore";
import { useToast } from "@/hooks/useToast";
import { useDeleteBatchFeeds } from "@/api/feeds/deleteFeedsId";
import styles from "./AlbumDelete.module.scss";
import { useRouter } from "next/router";

export default function AlbumDelete() {
  const modalData = useModalStore((state) => state.data);
  const closeModal = useModalStore((state) => state.closeModal);
  const { showToast } = useToast();
  const router = useRouter();

  const selectedFeedIds = modalData?.selectedFeedIds ?? [];
  const selectedCount = selectedFeedIds.length;

  const { mutate: deleteBatchFeeds, isPending } = useDeleteBatchFeeds();
  const handleDelete = () => {
    if (!selectedFeedIds.length) return;

    deleteBatchFeeds(
      { ids: selectedFeedIds },
      {
        onSuccess: () => {
          modalData?.onComplete?.();
        },
        onError: () => {
          showToast("삭제에 실패했습니다", "error");
        },
        onSettled: () => {
          closeModal();
          router.reload();
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.emptyContainer}>
        <h2 className={styles.title}>{selectedCount}개의 그림을 삭제할까요?</h2>
        <p className={styles.subtitle}>삭제 이후 되돌릴 수 없어요</p>
        <div className={styles.btns}>
          <div className={styles.cancleBtn}>
            <Button size="l" type="outlined-assistive" onClick={closeModal}>
              취소
            </Button>
          </div>
          <div className={styles.submitBtn}>
            <Button size="l" type="filled-primary" onClick={handleDelete} disabled={isPending}>
              {isPending ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
