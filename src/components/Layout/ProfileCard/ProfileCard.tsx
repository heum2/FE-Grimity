import IconComponent from "@/components/Asset/Icon";
import styles from "./ProfileCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProfileCardProps } from "./ProfileCard.types";
import Link from "next/link";
import { formattedDate } from "@/utils/formatDate";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import Icon from "@/components/Asset/IconTemp";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

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
    <div
      className={`${styles.container} 
      ${isEditMode ? styles.editmode : ""} 
      ${isSelected ? styles.selected : ""}`}
    >
      <div className={styles.imageContainer}>
        {hasMultipleImages && (
          <div className={styles.overlapIcon}>
            <Icon icon="gallery" size="2xl" />
          </div>
        )}
        <ResponsiveImage
          src={thumbnail}
          alt={title}
          loading="lazy"
          className={styles.image}
          ref={imgRef}
        />

        {isEditMode && (
          <div className={styles.checkmark}>
            <Icon icon={isSelected ? "checkedbox" : "checkbox"} size="2xl" />
          </div>
        )}
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.profileContainer}>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <Icon icon="heart" />
              <p className={styles.count}>{formatCurrency(likeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <Icon icon="speechBubble" />
              <p className={styles.count}>{formatCurrency(commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <Icon icon="eye" />
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
