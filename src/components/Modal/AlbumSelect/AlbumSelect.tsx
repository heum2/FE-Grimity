import { useState } from "react";
import { useMyAlbums } from "@/api/me/getMyAlbums";
import { useDeviceStore } from "@/states/deviceStore";
import { useModalStore } from "@/states/modalStore";
import styles from "./AlbumSelect.module.scss";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";

export default function AlbumSelect() {
  const { data } = useMyAlbums();
  const albums = Array.isArray(data) ? data : [];
  const modalData = useModalStore((state) => state.data);
  const [selectedId, setSelectedId] = useState<string | null>(modalData?.selectedAlbumId ?? null);
  const closeModal = useModalStore((state) => state.closeModal);
  const isMobile = useDeviceStore((state) => state.isMobile);

  const handleSubmit = () => {
    if (modalData?.onSelect) {
      const selectedAlbum = albums.find((album) => album.id === selectedId);
      modalData.onSelect(selectedId, selectedAlbum?.name ?? "앨범 선택");
    }
    closeModal();
  };

  const isEmpty = albums.length === 0;

  return (
    <div className={styles.container}>
      {!isMobile && !isEmpty && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>앨범 선택</h2>
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
            {albums.map((album: any) => (
              <div key={album.id}>
                <div
                  className={`${styles.albumItem} ${
                    selectedId === album.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedId((prevId) => (prevId === album.id ? null : album.id))}
                >
                  {album.name}
                  <div className={styles.checkIcon}></div>
                  {selectedId === album.id && <IconComponent name="checkAlbum" size={14} isBtn />}
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
              <Button size="l" type="filled-primary" onClick={handleSubmit}>
                완료
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
