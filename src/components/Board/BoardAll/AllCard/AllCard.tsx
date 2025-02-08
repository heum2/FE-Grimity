import IconComponent from "@/components/Asset/Icon";
import styles from "./AllCard.module.scss";
import Chip from "@/components/Chip/Chip";
import { timeAgo } from "@/utils/timeAgo";
import { AllCardProps } from "./AllCard.types";
import Image from "next/image";
import striptags from "striptags";
import Link from "next/link";

export function getTypeLabel(type: string): string {
  switch (type) {
    case "QUESTION":
      return "질문";
    case "FEEDBACK":
      return "피드백";
    case "NORMAL":
    default:
      return "일반";
  }
}

export default function AllCard({ post }: AllCardProps) {
  let plainTextContent = striptags(post.content);
  plainTextContent = plainTextContent.replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, "").trim();

  return (
    <div className={styles.container}>
      <div className={styles.chipContainer}>
        <Chip size="s" type="filled-assistive">
          {getTypeLabel(post.type)}
        </Chip>
      </div>
      <div className={styles.spaceBetween}>
        <Link href={`/posts/${post.id}`}>
          <div className={styles.titleContent}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>{post.title}</h2>
              {post.hasImage && <IconComponent name="boardAllImage" width={16} height={16} />}
              <div className={styles.comment}>
                <Image src="/icon/board-all-comment.svg" width={16} height={16} alt="" />
                {post.commentCount}
              </div>
            </div>
            <p className={styles.content}>{plainTextContent}</p>
          </div>
        </Link>
        <div className={styles.rightContainer}>
          <div className={styles.createdAtView}>
            <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
            <div className={styles.viewCount}>
              <Image src="/icon/board-all-view.svg" width={16} height={16} alt="" />
              {post.viewCount}
            </div>
          </div>
          <Link href={`/users/${post.author.id}`}>
            <p className={styles.author}>{post.author.name}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
