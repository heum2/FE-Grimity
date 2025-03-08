import Image from "next/image";
import { useState } from "react";
import styles from "./CommentInput.module.scss";
import Button from "@/components/Button/Button";
import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";
import TextArea from "@/components/TextArea/TextArea";
import { useRecoilValue } from "recoil";
import { isMobileState } from "@/states/isMobileState";

interface CommentInputProps {
  feedId: string;
  isLoggedIn: boolean;
  userData?: { image: string };
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
  const isMobile = useRecoilValue(isMobileState);
  const [comment, setComment] = useState("");
  const postCommentMutation = usePostFeedsComments();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!isLoggedIn || !comment.trim()) return;

    postCommentMutation.mutate(
      {
        feedId,
        content: comment,
      },
      {
        onSuccess: () => {
          setComment("");
          if (onCommentSubmitSuccess) {
            onCommentSubmitSuccess();
          }
        },
      },
    );
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
            src={
              userData.image !== "https://image.grimity.com/null"
                ? userData.image
                : "/image/default.svg"
            }
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
