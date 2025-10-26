import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";

import { useUserDataByUrl } from "@/api/users/getId";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { usePostChat } from "@/api/chats/postChat";

import Button from "@/components/Button/Button";
import ProfileCardSkeleton from "@/components/Layout/ProfileCardPopover/ProfileCardSkeleton";

import { PATH_ROUTES } from "@/constants/routes";

import type { ProfileCardPopoverProps } from "./ProfileCardPopover.types";

import styles from "./ProfileCardPopover.module.scss";

export default function ProfileCardPopover({
  authorUrl,
  onMouseEnter,
  onMouseLeave,
  position,
  placement,
}: ProfileCardPopoverProps) {
  const { data: userData, isLoading, isError } = useUserDataByUrl(authorUrl);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userId = useAuthStore((state) => state.user_id);

  const [isFollowing, setIsFollowing] = useState(userData?.isFollowing ?? false);

  const router = useRouter();

  const { mutateAsync: putFollow, isPending: isPutFollowPending } = usePutFollow();
  const { mutateAsync: deleteFollow, isPending: isDeleteFollowPending } = useDeleteFollow();
  const { mutateAsync: postChat, isPending: isPostChatPending } = usePostChat();

  const isMyProfile = userId === userData?.id;
  const shouldShowFollowButton = isLoggedIn && !isMyProfile;

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userData?.id) return;

    try {
      if (isFollowing) {
        await deleteFollow({ id: userData.id });
      } else {
        await putFollow({ id: userData.id });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleChat = async () => {
    const userId = userData?.id;
    if (!userId) {
      return;
    }

    const { id } = await postChat({
      targetUserId: userId,
    });

    router.push(`${PATH_ROUTES.DIRECT}/${id}`);
  };

  useEffect(() => {
    if (userData) {
      setIsFollowing(userData.isFollowing);
    }
  }, [userData]);

  const popoverContent = (
    <div
      className={`${styles.popover} ${placement === "top" ? styles.top : styles.bottom}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isLoading && <ProfileCardSkeleton />}

      {isError && <div className={styles.error}>프로필을 불러올 수 없습니다</div>}

      {userData && (
        <>
          <div className={styles.coverContainer}>
            <Image
              src={userData.backgroundImage ?? "/image/default-cover.png"}
              alt={`${userData.name} 커버 이미지`}
              fill
              className={styles.coverImage}
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>

          <div className={styles.profileSection}>
            <Link href={`/${userData.url}`} className={styles.profileImageContainer}>
              <Image
                src={userData.image ?? "/image/default.svg"}
                alt={userData.name}
                className={styles.profileImage}
                width={80}
                height={80}
                unoptimized
              />
            </Link>
          </div>

          <div className={styles.infoSection}>
            <Link href={`/${userData.url}`}>
              <h3 className={styles.name}>{userData.name}</h3>
            </Link>

            {userData.description && <p className={styles.description}>{userData.description}</p>}

            {shouldShowFollowButton && (
              <div className={styles.footer}>
                {isFollowing && (
                  <Button
                    type="filled-primary"
                    size="s"
                    disabled={isPutFollowPending || isDeleteFollowPending || isPostChatPending}
                    onClick={handleChat}
                  >
                    메시지 보내기
                  </Button>
                )}

                <Button
                  type={isFollowing ? "outlined-primary" : "filled-primary"}
                  size="s"
                  disabled={isPutFollowPending || isDeleteFollowPending}
                  onClick={handleFollowClick}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (typeof window === "undefined") return null;

  return createPortal(popoverContent, document.body);
}
