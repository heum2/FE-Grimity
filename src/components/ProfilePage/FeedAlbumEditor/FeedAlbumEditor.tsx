import { useState } from "react";
import { useRouter } from "next/router";

import { ModalState, ModalType, useModalStore } from "@/states/modalStore";

import ProfileCard from "@/components/Layout/ProfileCard/ProfileCard";
import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";

import { useDeviceStore } from "@/states/deviceStore";

import styles from "@/components/ProfilePage/FeedAlbumEditor/FeedAlbumEditor.module.scss";

interface Feed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string | Date;
  albumId?: string;
}

interface Album {
  id: string;
  name: string;
  feedCount: number;
}

interface FeedAlbumEditorProps {
  feeds: Feed[];
  albums: Album[];
  activeAlbum: string | null;
  onExitEditMode?: () => void;
}

export default function FeedAlbumEditor({
  feeds,
  albums,
  activeAlbum,
  onExitEditMode,
}: FeedAlbumEditorProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();
  const router = useRouter();
  const currentAlbum = activeAlbum ? albums.find((album) => album.id === activeAlbum) : null;
  const displayName = currentAlbum ? currentAlbum.name : "전체";
  const filteredFeeds = feeds;
  const displayCount = filteredFeeds.length;

  const handleCardSelect = (feedId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedCards.includes(feedId)) {
      setSelectedCards(selectedCards.filter((id) => id !== feedId));
    } else {
      setSelectedCards([...selectedCards, feedId]);
    }
  };

  const handleMoveAlbum = () => {
    if (selectedCards.length === 0) return;

    const modalData: Omit<ModalState, "isOpen"> = {
      type: "ALBUM-MOVE" as ModalType,
      data: {
        title: "앨범 이동",
        selectedFeedIds: selectedCards,
        currentAlbumId: activeAlbum,
        onComplete: () => {
          setSelectedCards([]);
        },
        ...(albums.length === 0 && { hideCloseButton: true }),
      },
    };

    if (isMobile) modalData.isFill = albums.length > 0;

    openModal(modalData);
  };

  const handleDeleteSelected = () => {
    if (selectedCards.length === 0) return;
    openModal({
      type: "ALBUM-DELETE",
      data: {
        hideCloseButton: true,
        selectedFeedIds: selectedCards,
        count: selectedCards.length,
        onComplete: () => {
          setSelectedCards([]);
        },
      },
    });
  };

  const handleGoBack = () => {
    if (onExitEditMode) {
      onExitEditMode();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        {/* 헤딩 */}
        <div className={styles.albumInfo}>
          <h1 className={styles.albumName}>{displayName}</h1>
          <p className={styles.feedCountContainer}>
            그림 <span className={styles.feedCount}>{displayCount}</span>
          </p>
        </div>

        {filteredFeeds.length === 0 ? (
          <div className={styles.emptyState}>
            <p>선택한 앨범에 그림이 없습니다.</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className={`${styles.cardWrapper} ${
                  selectedCards.includes(feed.id) ? styles.selected : ""
                }`}
                onClick={(e) => handleCardSelect(feed.id, e)}
              >
                <ProfileCard
                  title={feed.title}
                  cards={feed.cards}
                  thumbnail={feed.thumbnail}
                  likeCount={feed.likeCount}
                  commentCount={feed.commentCount}
                  viewCount={feed.viewCount}
                  createdAt={feed.createdAt}
                  id={feed.id}
                  isEditMode
                  isSelected={selectedCards.includes(feed.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.leftSection}>
            <Button
              className={styles.button}
              type="text-primary"
              size="m"
              leftIcon={<Icon icon="leftArrow" />}
              onClick={handleGoBack}
            >
              돌아가기
            </Button>
          </div>
          <div className={styles.rightSection}>
            <Button
              className={styles.button}
              type="text-primary"
              size="m"
              leftIcon={<Icon icon="close" />}
              onClick={handleDeleteSelected}
              disabled={selectedCards.length === 0}
            >
              {isMobile ? "삭제" : "선택 삭제"}
            </Button>
            <Button
              className={styles.button}
              type="text-primary"
              size="m"
              leftIcon={<Icon icon="move" />}
              onClick={handleMoveAlbum}
              disabled={selectedCards.length === 0}
            >
              {isMobile ? "이동" : "앨범 이동"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
