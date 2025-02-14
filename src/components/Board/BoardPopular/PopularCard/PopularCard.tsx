import { TodayPopularPostsResponse } from "@/api/posts/getTodayPopular";
import styles from "./PopularCard.module.scss";
import striptags from "striptags";
import { timeAgo } from "@/utils/timeAgo";
import IconComponent from "@/components/Asset/Icon";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRecoilValue } from "recoil";
import { isMobileState } from "@/states/isMobileState";

interface PopularCardProps {
  post: TodayPopularPostsResponse;
}

export default function PopularCard({ post }: PopularCardProps) {
  let plainTextContent = striptags(post.content);
  plainTextContent = plainTextContent.replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, "").trim();
  const isMobile = useRecoilValue(isMobileState);

  useIsMobile();

  return (
    <div className={styles.container}>
      <Link href={`/posts/${post.id}`}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.content}>{plainTextContent}</p>
      </Link>
      {!isMobile ? (
        <div className={styles.footer}>
          <Link href={`/users/${post.author.id}`}>
            <p className={styles.author}>{post.author.name}</p>
          </Link>
          <p className={styles.date}>{timeAgo(post.createdAt)}</p>
          <div className={styles.countContainer}>
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
            <div className={styles.likeContainer}>
              <IconComponent name="boardCommentCount" width={16} height={16} />
              <p className={styles.commentCount}>{formatCurrency(post.commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="boardViewCount" width={16} height={16} />
              <p className={styles.viewCount}>{formatCurrency(post.viewCount)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.footer}>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="boardCommentCount" width={16} height={16} />
              <p className={styles.commentCount}>{formatCurrency(post.commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="boardViewCount" width={16} height={16} />
              <p className={styles.viewCount}>{formatCurrency(post.viewCount)}</p>
            </div>
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
          </div>
          <p className={styles.date}>{timeAgo(post.createdAt)}</p>
        </div>
      )}
    </div>
  );
}
