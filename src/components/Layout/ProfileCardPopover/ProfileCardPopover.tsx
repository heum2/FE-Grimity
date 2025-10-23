import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";

import { useAuthStore } from "@/states/authStore";

import { useUserDataByUrl } from "@/api/users/getId";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";

import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";

import type { ProfileCardPopoverProps } from "./ProfileCardPopover.types";

import { formatCurrency } from "@/utils/formatCurrency";

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
  const [followerCount, setFollowerCount] = useState(userData?.followerCount ?? 0);

  const { mutateAsync: putFollow, isPending: isPutFollowPending } = usePutFollow();
  const { mutateAsync: deleteFollow, isPending: isDeleteFollowPending } = useDeleteFollow();

  const isMyProfile = userId === userData?.id;
  const shouldShowFollowButton = isLoggedIn && !isMyProfile;

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userData?.id) return;

    try {
      if (isFollowing) {
        await deleteFollow({ id: userData.id });
        setFollowerCount((prev) => prev - 1);
      } else {
        await putFollow({ id: userData.id });
        setFollowerCount((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

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
      {isLoading && <div className={styles.loading}>로딩 중...</div>}

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
            {shouldShowFollowButton && (
              <Button
                type={isFollowing ? "outlined-primary" : "filled-primary"}
                size="s"
                disabled={isPutFollowPending || isDeleteFollowPending}
                onClick={handleFollowClick}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </Button>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.nameRow}>
              <Link href={`/${userData.url}`}>
                <h3 className={styles.name}>{userData.name}</h3>
              </Link>
              <Icon icon="dot" className={styles.dot} />
              <div className={styles.followerCount}>
                <span>팔로워</span>
                <span className={styles.followerValue}>{formatCurrency(followerCount)}</span>
              </div>
            </div>

            {userData.description && <p className={styles.description}>{userData.description}</p>}
          </div>
        </>
      )}
    </div>
  );

  if (typeof window === "undefined") return null;

  return createPortal(popoverContent, document.body);
}
