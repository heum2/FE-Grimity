import React, { forwardRef } from "react";
import Image from "next/image";

import { useMyData } from "@/api/users/getMe";

import TextArea from "@/components/TextArea/TextArea";
import Button from "@/components/Button/Button";

import styles from "@/components/Detail/Comment/Comment.module.scss";

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
          <Image
            src={userData.image}
            width={24}
            height={24}
            alt="내 프로필"
            quality={50}
            className={styles.writerImage}
            unoptimized
          />
        ) : (
          <Image
            src="/image/default.svg"
            width={24}
            height={24}
            alt="내 프로필"
            quality={50}
            className={styles.writerImage}
            unoptimized
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
