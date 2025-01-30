import IconComponent from "@/components/Asset/Icon";
import styles from "./ProfileCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { ProfileCardProps } from "./ProfileCard.types";
import Link from "next/link";
import { formattedDate } from "@/utils/formatDate";

export default function ProfileCard({
  title,
  cards = [],
  thumbnail,
  likeCount,
  commentCount,
  id,
  createdAt,
}: ProfileCardProps) {
  const hasMultipleImages = cards && cards.length > 1;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
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
          <p className={styles.author}>{formattedDate(createdAt)}</p>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="cardLike" width={12} height={12} />
              <p className={styles.count}>{formatCurrency(likeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="cardComment" width={12} height={12} />
              <p className={styles.count}>{formatCurrency(commentCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
