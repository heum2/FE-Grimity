import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./RectangleCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { RectangleCardProps } from "./RectangleCard.types";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";

export default function RectangleCard({
  id,
  title,
  content,
  cards = [],
  author,
  likeCount,
  commentCount,
  createdAt,
  isSave,
}: RectangleCardProps) {
  // const [isSaved, setIsSaved] = useState(isSave);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  const hasMultipleImages = cards && cards.length > 1;

  // const handleLikeClick = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (isSaved) {
  //     await deleteLike(id);
  //     setCurrentLikeCount((prev) => prev - 1);
  //   } else {
  //     await putLike(id);
  //     setCurrentLikeCount((prev) => prev + 1);
  //   }
  //   setIsSaved(!isSaved);
  // };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {/* {isLoggedIn && (
          <div className={styles.saveBtn} onClick={handleLikeClick}>
            <IconComponent name={isLiked ? "cardSave" : "cardSave"} width={48} height={48} />
          </div>
        )} */}
        <Link href={`/feeds/${id}`}>
          <Image
            src={cards[0]}
            alt={title}
            layout="fill"
            objectFit="cover"
            className={styles.image}
          />
        </Link>
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.content}>{content}</p>
        <div className={styles.profileContainer}>
          <div>
            <p>{timeAgo(createdAt)}</p>
            <IconComponent name="cardDot" width={12} height={12} />
            <div className={styles.countContainer}>
              <div className={styles.likeContainer}>
                <IconComponent name="cardLike" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
              </div>
              <div className={styles.likeContainer}>
                <IconComponent name="cardComment" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(commentCount)}</p>
              </div>
            </div>
          </div>
          {author && (
            <>
              <Link href={`/users/${author.id}`}>
                <div className={styles.profile}>
                  <div className={styles.profileImage}>
                    {author.image !== "https://image.grimity.com/null" ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={24}
                        height={24}
                        className={styles.profileImage}
                      />
                    ) : (
                      <Image
                        src="/image/default.svg"
                        width={24}
                        height={24}
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
        </div>
      </div>
    </div>
  );
}
