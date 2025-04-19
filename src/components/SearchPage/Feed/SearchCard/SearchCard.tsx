import { useState, useContext } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SearchCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { useAuthStore } from "@/states/authStore";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import { SearchCardProps } from "./SearchCard.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { SearchHighlightContext } from "@/pages/search";
import "swiper/css";

export default function SearchCard({
  id,
  title,
  thumbnail,
  viewCount,
  likeCount,
  commentCount,
  isLike,
  tags,
  author,
}: SearchCardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(isLike);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const imgRef = usePreventRightClick<HTMLImageElement>();
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
            <IconComponent name={isLiked ? "cardLikeOn" : "cardLikeOff"} isBtn size={35} />
          </div>
        )}
        <Link href={`/feeds/${id}`}>
          <img src={thumbnail} alt={title} loading="lazy" className={styles.image} ref={imgRef} />
        </Link>
      </div>
      {tags.length > 0 && (
        <div className={styles.chips}>
          <Swiper spaceBetween={8} slidesPerView="auto" grabCursor={true} className={styles.swiper}>
            {tags.map((tag: string, index: number) => (
              <SwiperSlide key={index} className={styles.slide}>
                <Link href={`/search?tab=feed&keyword=${tag}`}>
                  <div className={styles.chip}>{tag}</div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
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
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} />
              <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="commentCount" size={16} />
              <p className={styles.count}>{formatCurrency(commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" size={16} />
              <p className={styles.count}>{formatCurrency(viewCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
