import IconComponent from "@/components/Asset/Icon";
import styles from "./BoardCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { BoardCardProps } from "./BoardCard.types";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

export default function BoardCard({
  id,
  title,
  commentCount,
  viewCount,
  createdAt,
  thumbnail,
}: BoardCardProps) {
  return (
    <div className={styles.container}>
      {thumbnail && (
        <div className={styles.thumbnailContainer}>
          <ResponsiveImage
            src={thumbnail}
            alt="썸네일"
            width={48}
            height={48}
            desktopSize={600}
            className={styles.thumbnailImage}
          />
        </div>
      )}
      <div className={styles.infoContainer}>
        <Link href={`/posts/${id}`}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.bottomContainer}>
            <div className={styles.countContainer}>
              <div className={styles.likeContainer}>
                <IconComponent name="commentCount" size={16} />
                <span className={styles.commentCount}>{formatCurrency(commentCount)}</span>
              </div>
              <div className={styles.likeContainer}>
                <IconComponent name="viewCount" size={16} />
                <span className={styles.count}>{formatCurrency(viewCount)}</span>
              </div>
            </div>
            <p className={styles.createdAt}>{timeAgo(createdAt)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
