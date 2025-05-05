import { useState } from "react";
import styles from "./EditableProfileCard.module.scss";
import ProfileCard from "@/components/Layout/ProfileCard/ProfileCard";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import { useModalStore } from "@/states/modalStore";
import { useRouter } from "next/router";

interface Feed {
  id: string;
  title: string;
  cards: any[];
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

interface EditableProfileCardProps {
  feeds: Feed[];
  albums: Album[];
  activeAlbum: string | null;
  onExitEditMode?: () => void;
}

export default function EditableProfileCard({
  feeds,
  albums,
  activeAlbum,
  onExitEditMode,
}: EditableProfileCardProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  const currentAlbum = activeAlbum
    ? albums.find((album) => album.id === activeAlbum)
    : { name: "전체", feedCount: feeds.length };

  const handleCardSelect = (feedId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedCards.includes(feedId)) {
      setSelectedCards(selectedCards.filter((id) => id !== feedId));
    } else {
      setSelectedCards([...selectedCards, feedId]);
    }
  };

  // 앨범 이동 모달 열기
  const handleMoveAlbum = () => {
    if (selectedCards.length === 0) return;

    openModal({
      type: "MOVE_ALBUM",
      props: {
        selectedFeedIds: selectedCards,
        onComplete: () => {
          setSelectedCards([]);
          // 이동 후 데이터를 새로고침하는 로직이 필요할 수 있음
        },
      },
    });
  };

  // 삭제 확인 모달 열기
  const handleDeleteSelected = () => {
    if (selectedCards.length === 0) return;

    openModal({
      type: "CONFIRM_DELETE",
      props: {
        selectedFeedIds: selectedCards,
        count: selectedCards.length,
        onConfirm: () => {
          // 삭제 후 데이터를 새로고침하는 로직이 필요할 수 있음
          setSelectedCards([]);
        },
      },
    });
  };

  // 돌아가기 핸들러
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
          <h1 className={styles.albumName}>{currentAlbum?.name}</h1>
          <p className={styles.feedCountContainer}>
            그림 <span className={styles.feedCount}> {currentAlbum?.feedCount}</span>
          </p>
        </div>

        {/* 그림 카드 그리드 모음 */}
        {feeds.length === 0 ? (
          <div className={styles.emptyState}>
            <p>그림이 없습니다.</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {feeds.map((feed) => (
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
                  isEditMode={true}
                  isSelected={selectedCards.includes(feed.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* 하단 푸터 (고정) */}
        <div className={styles.footer}>
          <div className={styles.leftSection}>
            <Button
              type="text-primary"
              size="m"
              leftIcon={<IconComponent name="backBtn" size={16} />}
              onClick={handleGoBack}
            >
              돌아가기
            </Button>
          </div>
          <div className={styles.rightSection}>
            <Button
              type="outlined-primary"
              size="m"
              disabled={selectedCards.length === 0}
              onClick={handleDeleteSelected}
            >
              선택 삭제
            </Button>
            <Button
              type="filled-primary"
              size="m"
              disabled={selectedCards.length === 0}
              onClick={handleMoveAlbum}
            >
              앨범 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
