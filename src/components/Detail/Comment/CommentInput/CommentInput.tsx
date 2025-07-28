import Image from "next/image";
import { useState } from "react";
import styles from "./CommentInput.module.scss";
import Button from "@/components/Button/Button";
import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";
import TextArea from "@/components/TextArea/TextArea";
import { useDeviceStore } from "@/states/deviceStore";

interface CommentInputProps {
  feedId: string;
  isLoggedIn: boolean;
  userData?: { image: string | null };
  showToast: (message: string, type: "error" | "success") => void;
  onCommentSubmitSuccess?: () => void;
}

export default function CommentInput({
  feedId,
  isLoggedIn,
  userData,
  showToast,
  onCommentSubmitSuccess,
}: CommentInputProps) {
  const { isMobile } = useDeviceStore();
  const [comment, setComment] = useState("");
  const { mutateAsync: postComment, isPending: isPostCommentPending } = usePostFeedsComments();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (isPostCommentPending) return;

    if (!isLoggedIn || !comment.trim()) return;

    try {
      await postComment({
        feedId,
        content: comment,
      });

      setComment("");
      if (onCommentSubmitSuccess) {
        onCommentSubmitSuccess();
      }
    } catch (error) {
      showToast("댓글 작성에 실패했습니다.", "error");
    }
  };

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      handleCommentSubmit();
    }
  };

  return (
    <section className={styles.inputContainer}>
      {!isMobile &&
        (isLoggedIn && userData ? (
          <Image
            src={userData.image !== null ? userData.image : "/image/default.svg"}
            width={40}
            height={40}
            alt="프로필 이미지"
            quality={50}
            className={styles.writerImage}
            unoptimized
          />
        ) : (
          <Image
            src="/image/default.svg"
            width={40}
            height={40}
            alt="프로필 이미지"
            quality={50}
            className={styles.writerImage}
            unoptimized
          />
        ))}
      <TextArea
        placeholder={isLoggedIn ? "댓글 달기" : "회원만 댓글 달 수 있어요!"}
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={handleEnterKeyDown}
        onFocus={() => {
          if (!isLoggedIn) {
            showToast("회원만 댓글 달 수 있어요!", "error");
          }
        }}
      />
      <div className={styles.submitBtn}>
        <Button size="l" type="filled-primary" onClick={handleCommentSubmit} disabled={!isLoggedIn}>
          댓글
        </Button>
      </div>
    </section>
  );
}
