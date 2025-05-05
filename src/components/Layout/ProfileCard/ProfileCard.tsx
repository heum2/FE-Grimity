import IconComponent from "@/components/Asset/Icon";
import styles from "./ProfileCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProfileCardProps } from "./ProfileCard.types";
import Link from "next/link";
import { formattedDate } from "@/utils/formatDate";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";

export default function ProfileCard({
  title,
  cards = [],
  thumbnail,
  likeCount,
  commentCount,
  id,
  createdAt,
  viewCount,
  albumId,
  isEditMode = false,
  isSelected = false,
}: ProfileCardProps) {
  const hasMultipleImages = cards && cards.length > 1;
  const imgRef = usePreventRightClick<HTMLImageElement>();

  const child = (
    <div className={`${styles.container} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.imageContainer}>
        {hasMultipleImages && (
          <div className={styles.overlapIcon}>
            <IconComponent name="overlap" size={24} />
          </div>
        )}
        <img src={thumbnail} alt={title} loading="lazy" className={styles.image} ref={imgRef} />

        {isSelected && (
          <div className={styles.checkmark}>
            <IconComponent name="checkedbox" size={20} />
          </div>
        )}
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.profileContainer}>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} />
              <p className={styles.count}>{formatCurrency(likeCount)}</p>
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
          <p className={styles.author}>{formattedDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );

  return isEditMode ? child : <Link href={`/feeds/${id}`}>{child}</Link>;
}
