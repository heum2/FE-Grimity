import IconComponent from "@/components/Asset/Icon";
import styles from "./BoardCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { BoardCardProps } from "./BoardCard.types";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";

export default function BoardCard({
  id,
  title,
  cards = [],
  author,
  likeCount,
  commentCount,
  createdAt,
}: BoardCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {author && (
          <>
            <Link href={`/users/${author.id}`}>
              <div className={styles.profile}>
                <div className={styles.profileImage}>
                  {author.image !== "https://image.grimity.com/null" ? (
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={20}
                      height={20}
                      className={styles.profileImage}
                    />
                  ) : (
                    <Image
                      src="/image/default.svg"
                      width={20}
                      height={20}
                      alt="프로필 이미지"
                      className={styles.profileImage}
                    />
                  )}
                </div>
                <p className={styles.author}>{author.name}</p>
              </div>
            </Link>
          </>
        )}
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.profileContainer}>
          <div className={styles.bottomContainer}>
            <div className={styles.countContainer}>
              <div className={styles.likeContainer}>
                <IconComponent name="boardLike" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(likeCount)}</p>
              </div>
              <div className={styles.likeContainer}>
                <IconComponent name="boardComment" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(commentCount)}</p>
              </div>
            </div>
            <Image src="/icon/card-dot.svg" width={2} height={2} alt="dot" />
            <p className={styles.createdAt}>{timeAgo(createdAt)}</p>
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Link href={`/feeds/${id}`}>
          <Image
            src={cards[0]}
            alt={title}
            width={90}
            height={90}
            objectFit="cover"
            className={styles.image}
          />
        </Link>
      </div>
    </div>
  );
}
