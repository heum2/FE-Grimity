import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SquareCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { SquareCardProps } from "./SquareCard.types";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import { timeAgo } from "@/utils/timeAgo";

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
  const { isLoggedIn } = useRecoilValue(authState);
  const [isLiked, setIsLiked] = useState(isLike);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const hasMultipleImages = cards && cards.length > 1;

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
      <div className={`${styles.imageContainer} ${isSame && styles.isSame}`}>
        {isLoggedIn && !cards && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent
              name={isLiked ? "cardLikeOn" : "cardLikeOff"}
              isBtn
              width={24}
              height={24}
            />
          </div>
        )}
        {hasMultipleImages && (
          <div className={styles.overlapIcon}>
            <IconComponent name="overlap" width={24} height={24} />
          </div>
        )}
        <Link href={`/feeds/${id}`}>
          <Image
            src={thumbnail}
            alt={title}
            layout="fill"
            objectFit="cover"
            className={styles.image}
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
              <Link href={`/users/${author?.id}`}>
                <p className={styles.author}>{author?.name}</p>
              </Link>
            )}
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" width={16} height={16} />
              <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" width={16} height={16} />
              <p className={styles.count}>{formatCurrency(viewCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
