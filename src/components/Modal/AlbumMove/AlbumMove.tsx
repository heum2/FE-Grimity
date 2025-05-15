import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styles from "./AlbumMove.module.scss";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import { useToast } from "@/hooks/useToast";
import { useMyAlbums } from "@/api/me/getMyAlbums";
import { useDeviceStore } from "@/states/deviceStore";
import { useModalStore } from "@/states/modalStore";
import { putFeedsInAlbums } from "@/api/albums/putFeedsInAlbums";
import { putFeedsNull } from "@/api/albums/putFeedsNull";
import { useRouter } from "next/router";

export default function AlbumMove() {
  const { data, refetch } = useMyAlbums();
  const albums = Array.isArray(data) ? data : [];
  const { showToast } = useToast();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const closeModal = useModalStore((state) => state.closeModal);
  const modalData = useModalStore((state) => state.data);
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedFeedIds = modalData?.selectedFeedIds || [];
  const initialId: string | null = modalData?.currentAlbumId ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  useEffect(() => {
    setSelectedId(initialId);
  }, [initialId]);

  const mutation = useMutation(
    (albumId: string | null) => putFeedsInAlbums(albumId, { ids: selectedFeedIds }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("feeds");
        queryClient.invalidateQueries("albums");
        modalData?.onComplete?.();
      },
      onError: () => {
        showToast("앨범 이동에 실패했습니다.", "error");
      },
      onSettled: () => {
        refetch();
        closeModal();
        router.reload();
      },
    },
  );

  const handleSubmit = async () => {
    if (selectedId === null) {
      try {
        await putFeedsNull({ ids: selectedFeedIds });
        queryClient.invalidateQueries("feeds");
        queryClient.invalidateQueries("albums");
        modalData?.onComplete?.();
        closeModal();
        router.reload();
      } catch {
        showToast("앨범 이동에 실패했습니다.", "error");
      }
      return;
    }

    mutation.mutate(selectedId);
  };

  const isEmpty = albums.length === 0;

  return (
    <div className={styles.container}>
      {!isMobile && !isEmpty && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>앨범 이동</h2>
          <p className={styles.subtitle}>
            <span className={styles.count}>{selectedFeedIds.length}</span>개의 그림 선택
          </p>
        </div>
      )}

      {isEmpty ? (
        <div className={styles.emptyContainer}>
          <h2 className={styles.title}>아직 생성된 앨범이 없어요</h2>
          <p className={styles.subtitle}>
            전체 앨범에 업로드 되며, <br />새 앨범은 프로필 화면에서 추가할 수 있어요
          </p>
          <Button size="l" type="filled-primary" onClick={closeModal}>
            확인
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.albumsContainer}>
            {/* 전체 앨범 */}
            <div
              className={`${styles.albumItem} ${selectedId === null ? styles.selected : ""}`}
              onClick={() => setSelectedId((prev) => (prev === null ? null : null))}
            >
              전체 앨범
              <div className={styles.checkIcon}></div>
              {selectedId === null && <IconComponent name="checkAlbum" size={14} />}
            </div>

            {/* 사용자 앨범 목록 */}
            {albums.map((album) => (
              <div key={album.id}>
                <div
                  className={`${styles.albumItem} ${
                    selectedId === album.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedId((prev) => (prev === album.id ? null : album.id))}
                >
                  {album.name}
                  <div className={styles.checkIcon}></div>
                  {selectedId === album.id && <IconComponent name="checkAlbum" size={14} />}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.btns}>
            <div className={styles.cancleBtn}>
              <Button size="l" type="outlined-assistive" onClick={closeModal}>
                취소
              </Button>
            </div>
            <div className={styles.submitBtn}>
              <Button
                size="l"
                type="filled-primary"
                onClick={handleSubmit}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "이동 중..." : "완료"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
