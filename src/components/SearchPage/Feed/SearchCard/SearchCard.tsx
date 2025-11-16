import { useState, useContext } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SearchCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { useAuthStore } from "@/states/authStore";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import { SearchCardProps } from "./SearchCard.types";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { SearchHighlightContext } from "@/pages/search";
import { useDeviceStore } from "@/states/deviceStore";
import "swiper/css";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

export default function SearchCard({
  id,
  title,
  thumbnail,
  viewCount,
  likeCount,
  commentCount,
  isLike,
  author,
}: SearchCardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(isLike);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const { isMobile } = useDeviceStore();
  const { highlight } = useContext(SearchHighlightContext);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      await deleteLike(id);
      setCurrentLikeCount((prev) => prev - 1);
    } else {
      await putLike(id);
      setCurrentLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {isLoggedIn && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent
              name={isLiked ? "cardLikeOn" : "cardLikeOff"}
              isBtn
              size={isMobile ? 24 : 35}
            />
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
          <h3 className={styles.title}>{highlight(title)}</h3>
        </Link>
        <div className={styles.profileContainer}>
          <Link href={`/${author?.url}`}>
            <p className={styles.author}>{highlight(author?.name)}</p>
          </Link>
          <IconComponent name="dot" size={3} />
          <div className={styles.countContainer}>
            <span className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} />
              <span className={styles.count}>{formatCurrency(currentLikeCount)}</span>
            </span>
            <span className={styles.likeContainer}>
              <IconComponent name="commentCount" size={16} />
              <span className={styles.count}>{formatCurrency(commentCount)}</span>
            </span>
            <span className={styles.likeContainer}>
              <IconComponent name="viewCount" size={16} />
              <span className={styles.count}>{formatCurrency(viewCount)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
