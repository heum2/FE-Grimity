import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SquareCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { SquareCardProps } from "./SquareCard.types";
import Link from "next/link";

export default function SquareCard({
  title,
  cards = [],
  author,
  likeCount,
  commentCount,
  id,
  isSave,
}: SquareCardProps) {
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
            <IconComponent name={isLiked ? "cardSaveOn" : "cardSaveOff"} width={48} height={48} />
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
        <div className={styles.profileContainer}>
          {author && (
            <>
              <Link href={`/users/${author.id}`}>
                <p className={styles.author}>{author.name}</p>
              </Link>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
