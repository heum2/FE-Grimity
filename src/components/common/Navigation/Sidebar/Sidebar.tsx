import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import Avatar from "@/components/common/Avatar/Avatar";
import Icon from "@/components/common/Icon/Icon";
import type { IconName } from "@/components/common/Icon/Icon.types";
import { FOOTER_ITEMS } from "@/constants/footer";
import { PATH_ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import styles from "./Sidebar.module.scss";
import type { SidebarProps } from "./Sidebar.types";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

const NOTICE_POST_PATH = "/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a";
const INQUIRY_EMAIL = "grimity.official@gmail.com";

type NavEntry =
  | {
      id: string;
      route: string;
      label: string;
      icon: IconName;
      isLogin?: boolean;
      showDmBadge?: boolean;
    }
  | { id: string; route: string; label: string; legacyIcon: "ranking"; isLogin?: boolean };

const NAV_ENTRIES: NavEntry[] = [
  { id: "home", route: PATH_ROUTES.HOME, icon: "home", label: "홈" },
  { id: "ranking", route: PATH_ROUTES.RANKING, icon: "paint", label: "랭킹" },
  { id: "following", route: PATH_ROUTES.FOLLOWING, icon: "following", label: "팔로잉", isLogin: true },
  { id: "board", route: PATH_ROUTES.BOARD, icon: "board", label: "자유게시판" },
  {
    id: "dm",
    route: PATH_ROUTES.DIRECT,
    icon: "message",
    label: "DM",
    isLogin: true,
    showDmBadge: true,
  },
];

function routeIsActive(route: string, pathname: string): boolean {
  if (route === "/" && pathname === "/") return true;
  if (route === PATH_ROUTES.DIRECT && pathname.startsWith("/direct")) return true;
  if (route === PATH_ROUTES.BOARD && (pathname === "/board" || pathname.startsWith("/posts/")))
    return true;
  if (pathname === route) return true;
  return false;
}

export default function Sidebar({
  className,
  onClose,
  onLoginClick,
  onLogoutClick,
  user,
  profileActiveItem,
  onProfileLikedClick,
  onProfileSavedClick,
}: SidebarProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore((s) => s);
  const { hasUnreadMessages } = useChatStore();
  const { showToast } = useToast();

  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const askRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  const visibleNav = NAV_ENTRIES.filter((item) => {
    if ("isLogin" in item && item.isLogin) return isLoggedIn;
    return true;
  });

  const navigate = useCallback(
    (route: string) => {
      void router.push(route);
      onClose?.();
    },
    [router, onClose]
  );

  const closeDropdowns = useCallback(() => {
    setIsAskOpen(false);
    setIsGuideOpen(false);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", closeDropdowns);
    return () => router.events.off("routeChangeComplete", closeDropdowns);
  }, [router.events, closeDropdowns]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (askRef.current && !askRef.current.contains(e.target as Node)) setIsAskOpen(false);
      if (guideRef.current && !guideRef.current.contains(e.target as Node)) setIsGuideOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const handleFooterClick = (label: string, route?: string) => {
    if (label === "안내") {
      setIsGuideOpen((v) => !v);
      setIsAskOpen(false);
    } else if (route) {
      onClose?.();
      window.location.href = route;
    } else if (label === "문의") {
      setIsAskOpen((v) => !v);
      setIsGuideOpen(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(INQUIRY_EMAIL);
      showToast("이메일이 복사되었습니다!", "success");
      onClose?.();
    } catch {
      showToast("복사에 실패했습니다.", "success");
    }
  };

  const renderNavIcon = (entry: NavEntry) => {
    return (
      <span className={styles.navIconSlot} aria-hidden>
        <Icon name={(entry as { icon: IconName }).icon} size={24} className={styles.navIcon} aria-hidden />
      </span>
    );
  };

  return (
    <aside
      className={clsx(styles.sidebar, !isLoggedIn && styles.guest, className)}
      aria-label="메뉴"
    >
      <div className={styles.mobileHeader}>
        {!isLoggedIn ? (
          <>
            <ResponsiveImage src="/image/logo.svg" alt="logo" desktopSize={100} mobileSize={100} />
            <SolidButton size="regular" onClick={onLoginClick} className={styles.loginButton}>
              로그인
            </SolidButton>
          </>
        ) : (
          user && (
            <>
              <div className={styles.profileRow}>
                <Avatar src={user.avatarSrc} size="ml" />
                <p className={styles.profileName}>{user.username}</p>
              </div>
              <div className={styles.profileMenu}>
                <button
                  type="button"
                  className={clsx(
                    styles.profileMenuBtn,
                    profileActiveItem === "liked" && styles.profileMenuBtnActive
                  )}
                  onClick={onProfileLikedClick}
                >
                  <span className={styles.profileMenuIcon}>
                    <Icon name="heart-fill" size={24} />
                  </span>
                  <span className={styles.profileMenuLabel}>좋아요한 그림</span>
                </button>
                <button
                  type="button"
                  className={clsx(
                    styles.profileMenuBtn,
                    profileActiveItem === "saved" && styles.profileMenuBtnActive
                  )}
                  onClick={onProfileSavedClick}
                >
                  <span className={styles.profileMenuIcon}>
                    <Icon name="bookmark-fill" size={24}  />
                  </span>
                  <span className={styles.profileMenuLabel}>저장한 글</span>
                </button>
              </div>
            </>
          )
        )}
      </div>

      <nav className={styles.nav} aria-label="주요 페이지">
        {visibleNav.map((entry) => {
          const active = routeIsActive(entry.route, router.pathname);
          const showBadge =
            "showDmBadge" in entry && entry.showDmBadge === true && hasUnreadMessages;

          return (
            <button
              key={entry.id}
              type="button"
              aria-current={active ? "page" : undefined}
              className={clsx(styles.navItem, active && styles.navItemActive)}
              onClick={() => navigate(entry.route)}
            >
              {renderNavIcon(entry)}
              <span className={clsx(styles.navLabel, showBadge && styles.navLabelBadge)}>
                {entry.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={styles.footerSection}>
        <div className={styles.footerItems}>
          {FOOTER_ITEMS.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              className={clsx(
                styles.footerRow,
                item.label === "공지사항" && styles.footerRowNotice,
                item.label === "안내" && styles.footerRowGuide
              )}
              onClick={() => handleFooterClick(item.label, item.route)}
            >
              <span className={styles.footerRowInner}>
                <Icon name={item.label === "공지사항" ? "info-circle" : "question-circle"} size={16} className={styles.footerIcon} aria-hidden />
                <span className={styles.footerLabel}>{item.label}</span>
              </span>
            </button>
          ))}
        </div>

        {isAskOpen && (
          <div className={styles.dropdown} ref={askRef} role="menu">
            <Link
              href="https://open.kakao.com/o/sKYFewgh"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dropdownItem}
              onClick={onClose}
            >
              오픈 카카오톡으로 이동
            </Link>
            <button type="button" className={styles.dropdownItem} onClick={copyEmail}>
              메일로 보내기
            </button>
          </div>
        )}

        {isGuideOpen && (
          <div className={styles.dropdown} ref={guideRef} role="menu">
            <Link href={NOTICE_POST_PATH} className={styles.dropdownItem} onClick={onClose}>
              공지사항
            </Link>
            <Link
              href="https://term.grimity.com/term"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dropdownItem}
              onClick={onClose}
            >
              이용약관
            </Link>
            <Link
              href="https://term.grimity.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dropdownItem}
              onClick={onClose}
            >
              개인정보취급방침
            </Link>
            <Link href="/business-info" className={styles.dropdownItem} onClick={onClose}>
              사업자 정보
            </Link>
          </div>
        )}

        <div className={styles.subLinks}>
          <div className={styles.subLinksRow}>
            <Link
              href="https://term.grimity.com/term"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.subLink}
              onClick={onClose}
            >
              이용약관
            </Link>
            <Link
              href="https://term.grimity.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.subLink}
              onClick={onClose}
            >
              개인정보처리방침
            </Link>
          </div>
          <Link href="/business-info" className={styles.subLink} onClick={onClose}>
            사업자 정보
          </Link>
          <p className={styles.copyright}>© Grimity. All rights reserved.</p>
        </div>

        {isLoggedIn && (
          <button type="button" className={styles.logout} onClick={onLogoutClick}>
            로그아웃
            <Icon name="out" size={16} color="gray-subtle" className={styles.logoutIcon} aria-hidden />
          </button>
        )}
      </div>
    </aside>
  );
}
