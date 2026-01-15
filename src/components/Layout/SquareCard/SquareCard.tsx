import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SquareCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { SquareCardProps } from "./SquareCard.types";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import Link from "next/link";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { timeAgo } from "@/utils/timeAgo";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

export default function SquareCard({
  title,
  thumbnail,
  cards,
  author,
  likeCount,
  viewCount,
  id,
  isLike,
  createdAt,
  isSame,
}: SquareCardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(isLike ?? false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const hasMultipleImages = cards && cards.length > 1;
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(author?.url);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(
      { id, isLiked },
      {
        onSuccess: () => {
          setIsLiked(!isLiked);
          setCurrentLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.imageContainer} ${isSame && styles.isSame}`}>
        {isLoggedIn && !cards && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent name={isLiked ? "cardLikeOn" : "cardLikeOff"} isBtn size={24} />
          </div>
        )}
        {hasMultipleImages && (
          <div className={styles.overlapIcon}>
            <IconComponent name="overlap" size={24} />
          </div>
        )}
        <Link href={`/feeds/${id}`}>
          <ResponsiveImage
            src={thumbnail}
            alt={title}
            loading="lazy"
            className={styles.image}
            ref={imgRef}
          />
        </Link>
      </div>
      <div className={styles.infoContainer}>
        <Link href={`/feeds/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        <div className={styles.profileContainer}>
          <div className={styles.countContainer}>
            {createdAt ? (
              <p className={styles.createdAt}>{timeAgo(createdAt)}</p>
            ) : (
              <span ref={targetRef} {...triggerProps}>
                <Link href={`/${author?.url}`}>
                  <p className={styles.author}>{author?.name}</p>
                </Link>
              </span>
            )}
            <IconComponent name="dot" size={3} />
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} />
              <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" size={16} />
              <p className={styles.count}>{formatCurrency(viewCount)}</p>
            </div>
          </div>
        </div>
      </div>
      {isOpen && author?.url && <ProfileCardPopover {...popoverProps} authorUrl={author.url} />}
    </div>
  );
}
