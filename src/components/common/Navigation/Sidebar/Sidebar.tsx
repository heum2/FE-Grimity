import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Avatar from "@/components/common/Avatar/Avatar";
import Divider from "@/components/common/Divider/Divider";
import Icon from "@/components/common/Icon/Icon";
import type { IconName } from "@/components/common/Icon/Icon.types";
import Menu from "@/components/common/Navigation/Menu/Menu";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import { PATH_ROUTES } from "@/constants/routes";
import { EXTERNAL_URLS } from "@/constants/serviceurl";
import { useToast } from "@/hooks/useToast";
import { useChatStore } from "@/states/chatStore";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "./Sidebar.module.scss";
import type { SidebarProps } from "./Sidebar.types";

const INQUIRY_EMAIL = "grimity.official@gmail.com";

interface NavEntry {
  id: string;
  route: string;
  label: string;
  icon: IconName;
  isLogin?: boolean;
  showDmBadge?: boolean;
}

const NAV_ENTRIES: NavEntry[] = [
  { id: "home", route: PATH_ROUTES.HOME, icon: "home", label: "홈" },
  { id: "ranking", route: PATH_ROUTES.RANKING, icon: "paint", label: "랭킹" },
  {
    id: "following",
    route: PATH_ROUTES.FOLLOWING,
    icon: "following",
    label: "팔로잉",
    isLogin: true,
  },
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
  return pathname === route;
}

type ActiveDropdown = "ask" | "guide" | null;

export default function Sidebar({
  className,
  isLoggedIn = false,
  isOpen = true,
  onClose,
  onLoginClick,
  onLogoutClick,
  user,
  profileActiveItem,
  onProfileLikedClick,
  onProfileSavedClick,
  activeRoute,
  onNavigate,
}: SidebarProps) {
  const router = useRouter();
  const hasUnreadMessages = useChatStore((s) => s.hasUnreadMessages);
  const isMobile = useDeviceStore((s) => s.isMobile);
  const { showToast } = useToast();

  const footerIconSize = isMobile ? 16 : 20;

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const guideDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const askDropdownWrapperRef = useRef<HTMLDivElement>(null);

  const visibleNav = useMemo(
    () => NAV_ENTRIES.filter((entry) => !entry.isLogin || isLoggedIn),
    [isLoggedIn],
  );

  const navigate = useCallback(
    (route: string) => {
      onNavigate?.(route);
      if (router.pathname === route) {
        router.reload();
      } else {
        void router.push(route);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      onClose?.();
    },
    [router, onClose, onNavigate],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INQUIRY_EMAIL);
      showToast("이메일이 복사되었습니다!", "success");
      onClose?.();
    } catch {
      showToast("복사에 실패했습니다.", "error");
    }
  }, [showToast, onClose]);

  useEffect(() => {
    const close = () => setActiveDropdown(null);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (guideDropdownWrapperRef.current?.contains(target)) return;
      if (askDropdownWrapperRef.current?.contains(target)) return;
      setActiveDropdown(null);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const profileMenuItems = useMemo(
    () => [
      {
        icon: "heart-fill" as IconName,
        label: "좋아요한 그림",
        active: profileActiveItem === "liked",
        onClick: onProfileLikedClick,
      },
      {
        icon: "bookmark-fill" as IconName,
        label: "저장한 글",
        active: profileActiveItem === "saved",
        onClick: onProfileSavedClick,
      },
    ],
    [profileActiveItem, onProfileLikedClick, onProfileSavedClick],
  );

  const openExternal = useCallback(
    (url: string) => {
      window.open(url, "_blank", "noopener noreferrer");
      onClose?.();
    },
    [onClose],
  );

  const mobileHeaderContent = isLoggedIn ? (
    user && (
      <>
        <div className={styles.profileRow}>
          <div className={styles.profileAvatar}>
            <Avatar src={user.avatarSrc} size="ml" />
          </div>
          <p className={styles.profileName}>{user.username}</p>
        </div>
        <div className={styles.profileMenu}>
          {profileMenuItems.map(({ icon, label, active, onClick }) => (
            <button
              key={label}
              type="button"
              className={clsx(styles.profileMenuBtn, active && styles.profileMenuBtnActive)}
              onClick={onClick}
            >
              <span className={styles.profileMenuIcon}>
                <Icon name={icon} size={24} />
              </span>
              <span className={styles.profileMenuLabel}>{label}</span>
            </button>
          ))}
        </div>
        <Divider variant="secondary" className={styles.mobileDivider} />
      </>
    )
  ) : (
    <>
      <Icon name="logo" size={64} className={styles.logo}/>
      <SolidButton size="regular" onClick={onLoginClick} className={styles.loginButton}>
        로그인
      </SolidButton>
    </>
  );

  const askMenuItems = useMemo(
    () => [
      { label: "오픈 카카오톡으로 이동", onClick: () => openExternal(EXTERNAL_URLS.KAKAO_INQUIRY) },
      { label: "메일로 보내기", onClick: copyEmail },
    ],
    [openExternal, copyEmail],
  );

  const guideMenuItems = useMemo(
    () => [
      { label: "공지사항", onClick: () => navigate(PATH_ROUTES.NOTICE) },
      { label: "이용약관", onClick: () => openExternal(EXTERNAL_URLS.TERMS) },
      { label: "개인정보취급방침", onClick: () => openExternal(EXTERNAL_URLS.PRIVACY) },
      { label: "사업자 정보", onClick: () => navigate(PATH_ROUTES.BUSINESS_INFO) },
    ],
    [navigate, openExternal],
  );

  return (
    <>
      {onClose && (
        <div
          className={clsx(styles.overlay, isOpen && styles.overlayOpen)}
          aria-hidden
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          styles.sidebar,
          !isLoggedIn && styles.guest,
          isOpen && styles.open,
          className,
        )}
        aria-label="메뉴"
      >
      <div className={styles.sidebarBody}>
        <div className={styles.mobileHeader}>{mobileHeaderContent}</div>

        <nav className={styles.nav} aria-label="주요 페이지">
          {visibleNav.map((entry) => {
            const active = routeIsActive(entry.route, activeRoute ?? router.pathname);
            const showBadge = entry.showDmBadge && hasUnreadMessages;

            return (
              <button
                key={entry.id}
                type="button"
                aria-current={active ? "page" : undefined}
                className={clsx(styles.navItem, active && styles.navItemActive)}
                onClick={() => navigate(entry.route)}
              >
                <span className={styles.navIconSlot} aria-hidden>
                  <Icon name={entry.icon} size={24} />
                </span>
                <span className={clsx(styles.navLabel, showBadge && styles.navLabelBadge)}>
                  {entry.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={styles.footerSection}>
        <div className={styles.footerItems}>
          <button
            type="button"
            className={clsx(styles.footerRow, styles.footerRowNotice)}
            onClick={() => navigate(PATH_ROUTES.NOTICE)}
          >
            <Icon name="info-circle" size={footerIconSize} className={styles.footerIcon} aria-hidden />
            <span className={styles.footerLabel}>공지사항</span>
          </button>

          <div
            ref={guideDropdownWrapperRef}
            className={clsx(styles.footerBtnWrapper, styles.footerBtnWrapperGuide)}
          >
            {activeDropdown === "guide" && (
              <div id="guide-dropdown" className={styles.dropdown}>
                <Menu items={guideMenuItems} />
              </div>
            )}
            <button
              type="button"
              className={clsx(styles.footerRow, styles.footerRowGuide)}
              aria-expanded={activeDropdown === "guide"}
              aria-controls={activeDropdown === "guide" ? "guide-dropdown" : undefined}
              aria-haspopup="menu"
              onClick={() => setActiveDropdown((v) => (v === "guide" ? null : "guide"))}
            >
              <Icon name="info-circle" size={footerIconSize} className={styles.footerIcon} aria-hidden />
              <span className={styles.footerLabel}>안내</span>
            </button>
          </div>

          <div ref={askDropdownWrapperRef} className={styles.footerBtnWrapper}>
            {activeDropdown === "ask" && (
              <div id="ask-dropdown" className={styles.dropdown}>
                <Menu items={askMenuItems} />
              </div>
            )}
            <button
              type="button"
              className={styles.footerRow}
              aria-expanded={activeDropdown === "ask"}
              aria-controls={activeDropdown === "ask" ? "ask-dropdown" : undefined}
              aria-haspopup="menu"
              onClick={() => setActiveDropdown((v) => (v === "ask" ? null : "ask"))}
            >
              <Icon name="question-circle" size={footerIconSize} className={styles.footerIcon} aria-hidden />
              <span className={styles.footerLabel}>문의</span>
            </button>
          </div>
        </div>

        {isLoggedIn && (
          <button type="button" className={styles.logout} onClick={onLogoutClick}>
            로그아웃
            <Icon
              name="out"
              size={16}
              color="gray-subtle"
              className={styles.logoutIcon}
              aria-hidden
            />
          </button>
        )}

        <div className={styles.subLinks}>
          <div className={styles.subLinksRow}>
            <Link
              href={EXTERNAL_URLS.TERMS}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.subLink}
              onClick={onClose}
            >
              이용약관
            </Link>
            <Link
              href={EXTERNAL_URLS.PRIVACY}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.subLink}
              onClick={onClose}
            >
              개인정보처리방침
            </Link>
          </div>
          <Link href={PATH_ROUTES.BUSINESS_INFO} className={styles.subLink} onClick={onClose}>
            사업자 정보
          </Link>
          <p className={styles.copyright}>© Grimity. All rights reserved.</p>
        </div>
      </div>
      </aside>
    </>
  );
}
