import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import UserHover from "@/components/common/Card/UserHover/UserHover";
import { useUserDataByUrl } from "@/api/users/getId";
import { useAuthStore } from "@/states/authStore";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";

import styles from "./Album.module.scss";

const HOVER_OPEN_DELAY = 200;
const HOVER_CLOSE_DELAY = 150;
const HOVER_CARD_HEIGHT = 350;
const HOVER_GAP = 10;

interface AlbumAuthorNicknameProps {
  nickname: string;
  profileHref?: string;
  authorUrl?: string;
}

type Position = {
  left: number;
  /** 화면 위쪽에 띄울 때는 top, 아래쪽에 띄울 때는 top 으로 동일 처리 (위쪽일 땐 wrap top - gap - estimate). */
  top: number;
  placement: "top" | "bottom";
};

/**
 * Album 카드의 작성자 닉네임 + 호버 시 UserHover 팝업.
 * - profileHref 가 있으면 닉네임을 <Link>로 감쌈
 * - authorUrl 이 있으면 호버 시 작성자 프로필을 lazy fetch 하여 UserHover 노출
 * - 팝업은 Portal 로 document.body 에 렌더 (부모 overflow:hidden 영향을 받지 않음)
 */
export default function AlbumAuthorNickname({
  nickname,
  profileHref,
  authorUrl,
}: AlbumAuthorNicknameProps) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showToast } = useToast();
  const { mutate: putFollow } = usePutFollow();
  const { mutate: deleteFollow } = useDeleteFollow();

  const enabledFetch = isHoverEnabled && !!authorUrl;
  const { data: profile } = useUserDataByUrl(enabledFetch ? authorUrl! : null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const computePosition = (): Position | null => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const placement: "top" | "bottom" = rect.top >= HOVER_CARD_HEIGHT ? "top" : "bottom";
    const top =
      placement === "top"
        ? rect.top - HOVER_GAP - HOVER_CARD_HEIGHT
        : rect.bottom + HOVER_GAP;
    return { left: rect.left, top, placement };
  };

  const handleMouseEnter = () => {
    if (!authorUrl) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openTimerRef.current = setTimeout(() => {
      const next = computePosition();
      if (!next) return;
      setPosition(next);
      setIsHoverEnabled(true);
      setIsOpen(true);
    }, HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => setIsOpen(false), HOVER_CLOSE_DELAY);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleFollowClick = () => {
    if (!profile) return;
    if (!isLoggedIn) {
      showToast("로그인이 필요합니다.", "warning");
      return;
    }
    if (profile.isFollowing) {
      deleteFollow({ id: profile.id });
    } else {
      putFollow({ id: profile.id });
    }
  };

  const nicknameNode = profileHref ? (
    <Link
      href={profileHref}
      className={styles.nicknameLink}
      onClick={(e) => e.stopPropagation()}
    >
      {nickname}
    </Link>
  ) : (
    <span className={styles.nicknameText}>{nickname}</span>
  );

  return (
    <span
      ref={wrapRef}
      className={styles.nicknameWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {nicknameNode}

      {mounted &&
        isOpen &&
        profile &&
        position &&
        createPortal(
          <div
            className={styles.hoverPopup}
            style={{ top: position.top, left: position.left }}
            onMouseEnter={cancelClose}
            onMouseLeave={handleMouseLeave}
          >
            <UserHover
              isFollowing={profile.isFollowing}
              bannerUrl={profile.backgroundImage ?? undefined}
              avatarUrl={profile.image ?? undefined}
              nickname={profile.name}
              content={profile.description}
              onFollowClick={handleFollowClick}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
