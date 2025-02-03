import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./RectangleCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { RectangleCardProps } from "./RectangleCard.types";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";

export default function RectangleCard({
  id,
  title,
  content,
  thumbnail,
  author,
  likeCount: initialLikeCount,
  commentCount,
  createdAt,
  isLike: initialIsLike,
}: RectangleCardProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const [isLiked, setIsLiked] = useState(initialIsLike);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {isLoggedIn && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent
              name={isLiked ? "cardLikeOn" : "cardLikeOff"}
              isBtn
              width={24}
              height={24}
            />
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
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.content}>{content}</p>
        <div className={styles.profileContainer}>
          <div className={styles.informationContainer}>
            <p className={styles.createdAt}>{timeAgo(createdAt)}</p>
            <Image src="/icon/card-dot.svg" width={2} height={2} alt="" />
            <div className={styles.countContainer}>
              <div className={styles.likeContainer}>
                <IconComponent name="likeCount" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(likeCount)}</p>
              </div>
              <div className={styles.likeContainer}>
                <IconComponent name="commentCount" width={12} height={12} />
                <p className={styles.count}>{formatCurrency(commentCount)}</p>
              </div>
            </div>
          </div>
          {author && (
            <Link href={`/users/${author.id}`}>
              <div className={styles.profile}>
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
                <p className={styles.author}>{author.name}</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
