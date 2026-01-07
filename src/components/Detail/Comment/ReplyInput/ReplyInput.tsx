import React, { forwardRef } from "react";

import { useMyData } from "@/api/users/getMe";

import TextArea from "@/components/TextArea/TextArea";
import Button from "@/components/Button/Button";

import styles from "@/components/Detail/Comment/Comment.module.scss";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

type ToastType = "success" | "error" | "warning" | "information";

interface ReplyInputProps {
  isChildReply?: boolean;
  replyText: string;
  onReplyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoggedIn: boolean;
  showToast: (message: string, type: ToastType) => void;
  handleReplySubmit: () => void;
}

const ReplyInput = forwardRef<HTMLTextAreaElement, ReplyInputProps>(
  (
    {
      isChildReply = false,
      replyText,
      onReplyTextChange,
      onKeyDown,
      isLoggedIn,
      showToast,
      handleReplySubmit,
    }: ReplyInputProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const { data: userData } = useMyData();

    return (
      <div className={styles.input}>
        {userData && userData.image !== null ? (
          <ResponsiveImage
            src={userData.image}
            width={24}
            height={24}
            alt="내 프로필"
            className={styles.writerImage}
          />
        ) : (
          <ResponsiveImage
            src="/image/default.svg"
            width={24}
            height={24}
            alt="내 프로필"
            className={styles.writerImage}
          />
        )}
        <TextArea
          ref={ref}
          placeholder={isLoggedIn ? "답글 달기" : "회원만 답글 달 수 있어요!"}
          value={replyText}
          onChange={onReplyTextChange}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (!isLoggedIn) {
              showToast("회원만 답글 달 수 있어요!", "error");
            }
          }}
          isReply
        />
        <div className={`${styles.submitBtn} ${isChildReply ? styles.childSubmitBtn : ""}`}>
          <Button size="m" type="filled-primary" onClick={handleReplySubmit} disabled={!isLoggedIn}>
            답글
          </Button>
        </div>
      </div>
    );
  },
);

ReplyInput.displayName = "ReplyInput";

export default ReplyInput;
