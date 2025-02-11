import IconComponent from "@/components/Asset/Icon";
import styles from "./AllCard.module.scss";
import Chip from "@/components/Chip/Chip";
import { timeAgo } from "@/utils/timeAgo";
import { AllCardProps } from "./AllCard.types";
import Image from "next/image";
import striptags from "striptags";
import Link from "next/link";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";
import { useState } from "react";

export function getTypeLabel(type: string): string {
  switch (type) {
    case "QUESTION":
      return "질문";
    case "FEEDBACK":
      return "피드백";
    case "NOTICE":
      return "공지";
    case "NORMAL":
    default:
      return "일반";
  }
}

export default function AllCard({ post, case: cardCase }: AllCardProps) {
  let plainTextContent = striptags(post.content);
  plainTextContent = plainTextContent.replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, "").trim();
  const [isSaved, setIsSaved] = useState(true);

  const handleSaveClick = async () => {
    if (isSaved) {
      await deletePostsSave(post.id);
    } else {
      await putPostsSave(post.id);
    }
    setIsSaved(!isSaved);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chipContainer}>
        {post.type === "notice" ? (
          <Chip size="s" type="filled-secondary">
            {getTypeLabel(post.type)}
          </Chip>
        ) : (
          <Chip size="s" type="filled-assistive">
            {getTypeLabel(post.type)}
          </Chip>
        )}
      </div>
      <div className={styles.spaceBetween}>
        <Link href={`/posts/${post.id}`}>
          <div className={styles.titleContent}>
            <div className={styles.titleContainer}>
              <h2 className={post.type === "notice" ? styles.noticeTitle : styles.title}>
                {post.title}
              </h2>
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
          {cardCase === "saved-posts" ? (
            <div className={styles.savedPosts}>
              <div className={styles.savedCreatedAtView}>
                <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                <div className={styles.viewCount}>
                  <Image src="/icon/board-all-view.svg" width={16} height={16} alt="" />
                  {post.viewCount}
                </div>
              </div>
              <div onClick={handleSaveClick}>
                <IconComponent
                  name={isSaved ? "saveOn" : "saveOff"}
                  width={20}
                  height={20}
                  padding={8}
                  isBtn
                />
              </div>
            </div>
          ) : (
            <div className={styles.createdAtView}>
              <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
              <Image src="/icon/dot.svg" width={3} height={3} alt="" />
              <div className={styles.viewCount}>
                <Image src="/icon/board-all-view.svg" width={16} height={16} alt="" />
                {post.viewCount}
              </div>
            </div>
          )}
          {post.type !== "notice" && post.author && (
            <Link href={`/users/${post.author.id}`}>
              <p className={styles.author}>{post.author.name}</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
