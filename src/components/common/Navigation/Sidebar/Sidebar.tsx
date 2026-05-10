import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import Avatar from "@/components/common/Avatar/Avatar";
import Divider from "@/components/common/Divider/Divider";
import Icon from "@/components/common/Icon/Icon";
import type { IconName } from "@/components/common/Icon/Icon.types";
import Menu from "@/components/common/Navigation/Menu/Menu";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { PATH_ROUTES } from "@/constants/routes";
import { EXTERNAL_URLS } from "@/constants/serviceurl";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/states/authStore";
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
  const { isLoggedIn } = useAuthStore((s) => s);
  const { hasUnreadMessages } = useChatStore();
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();

  const footerIconSize = isMobile ? 16 : 20;

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleNav = NAV_ENTRIES.filter((entry) => !entry.isLogin || isLoggedIn);

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
      showToast("복사에 실패했습니다.", "success");
    }
  }, [showToast, onClose]);

  useEffect(() => {
    const close = () => setActiveDropdown(null);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const profileMenuItems = [
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
  ];

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
      <ResponsiveImage src="/image/logo.svg" alt="logo" desktopSize={100} mobileSize={100} />
      <SolidButton size="regular" onClick={onLoginClick} className={styles.loginButton}>
        로그인
      </SolidButton>
    </>
  );

  const askMenuItems = [
    { label: "오픈 카카오톡으로 이동", onClick: () => openExternal(EXTERNAL_URLS.KAKAO_INQUIRY) },
    { label: "메일로 보내기", onClick: copyEmail },
  ];

  const guideMenuItems = [
    { label: "공지사항", onClick: () => navigate(PATH_ROUTES.NOTICE) },
    { label: "이용약관", onClick: () => openExternal(EXTERNAL_URLS.TERMS) },
    { label: "개인정보취급방침", onClick: () => openExternal(EXTERNAL_URLS.PRIVACY) },
    { label: "사업자 정보", onClick: () => navigate(PATH_ROUTES.BUSINESS_INFO) },
  ];

  return (
    <aside
      className={clsx(styles.sidebar, !isLoggedIn && styles.guest, className)}
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

          <div className={clsx(styles.footerBtnWrapper, styles.footerBtnWrapperGuide)}>
            {activeDropdown === "guide" && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <Menu items={guideMenuItems} />
              </div>
            )}
            <button
              type="button"
              className={clsx(styles.footerRow, styles.footerRowGuide)}
              onClick={() => setActiveDropdown((v) => (v === "guide" ? null : "guide"))}
            >
              <Icon name="info-circle" size={footerIconSize} className={styles.footerIcon} aria-hidden />
              <span className={styles.footerLabel}>안내</span>
            </button>
          </div>

          <div className={styles.footerBtnWrapper}>
            {activeDropdown === "ask" && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <Menu items={askMenuItems} />
              </div>
            )}
            <button
              type="button"
              className={styles.footerRow}
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
  );
}
