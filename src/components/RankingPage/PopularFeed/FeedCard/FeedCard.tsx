import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./FeedCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { FeedCardProps } from "./FeedCard.types";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

export default function FeedCard({
  id,
  title,
  thumbnail,
  viewCount,
  likeCount,
  isLike,
  author,
}: FeedCardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(isLike ?? false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const imgRef = usePreventRightClick<HTMLImageElement>();
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
      <div className={styles.imageContainer}>
        {isLoggedIn && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent name={isLiked ? "cardLikeOn" : "cardLikeOff"} size={24} isBtn />
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
          <Link href={`/${author.url}`}>
            <p className={styles.author}>{author?.name}</p>
          </Link>
          <IconComponent name="dot" size={3} />
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} />
              <span className={styles.count}>{formatCurrency(currentLikeCount)}</span>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" size={16} />
              <span className={styles.count}>{formatCurrency(viewCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
