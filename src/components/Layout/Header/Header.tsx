import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";

import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import Notifications from "@/components/Notifications/Notifications";
import FooterSection from "@/components/Layout/FooterSection/FooterSection";
import Login from "@/components/Modal/Login/Login";

import { useIsMobile } from "@/hooks/useIsMobile";
import useAuthCheck from "@/hooks/useAuthCheck";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import axiosInstance from "@/constants/baseurl";

import { useModal } from "@/hooks/useModal";

import styles from "./Header.module.scss";

export default function Header() {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState("홈");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [, setIsHome] = useState(false);

  const activeItemRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);

  const { openModal } = useModal();
  useAuthCheck(setIsHome);
  useIsMobile();
  usePreventScroll(isMenuOpen || (isMobile && showNotifications));
  useOnClickOutside(notificationRef, () => setShowNotifications(false));
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const { data: myData } = useMyData();

  const isPostPage = ["/board", "/board/write", "/posts/[id]", "/posts/[id]/edit"].includes(
    router.pathname,
  );
  const isNavPage = ["/", "/ranking", "/board", "/following", "/board/write"].includes(
    router.pathname,
  );
  const hideBtn = ["/write", "/feeds/[id]/edit", "/board/write", "/posts/[id]/edit"].includes(
    router.pathname,
  );

  const navItems = [
    { name: "홈", path: "/" },
    { name: "랭킹", path: "/ranking" },
    { name: "자유게시판", path: "/board" },
  ];

  if (isLoggedIn) {
    navItems.push({ name: "팔로잉", path: "/following" });
  }

  let name: "bellActive" | "bell";

  if (myData?.hasNotification) {
    name = "bellActive";
  } else {
    name = "bell";
  }

  const handleNavClick = (item: { name: string; path: string }) => {
    setActiveNav(item.name);

    if (router.pathname === item.path) {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(item.path);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "exclude-access-token": true,
            },
          },
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      setAccessToken("");
      setUserId("");
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (isMobile || isTablet) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleClickLogo = () => {
    if (router.pathname === "/") {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSubmenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  const handleOpenLoginModal = () => {
    openModal((close) => <Login close={close} />);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (showNotifications) {
      window.history.pushState({ isNotificationOpen: true }, "", window.location.href);

      function handlePopState(event: PopStateEvent) {
        setShowNotifications(false);
      }

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isMobile, showNotifications]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find(
      (item) =>
        currentPath === item.path || (item.path === "/board" && currentPath.startsWith("/board/")),
    );
    if (activeItem) {
      setActiveNav(activeItem.name);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (isNavPage && activeItemRef.current && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
      indicatorRef.current.style.width = `${offsetWidth}px`;
    } else if (!isNavPage && indicatorRef.current) {
      indicatorRef.current.style.transform = "none";
      indicatorRef.current.style.width = "0px";
    }
  }, [activeNav]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.cursor} onClick={handleClickLogo}>
            <img src={"/image/logo.svg"} width={100} height={29} alt="logo" loading="lazy" />
          </div>
        </div>
        <div className={styles.wrapper}>
          {isMobile && !isLoggedIn && (
            <div className={styles.uploadBtn} onClick={handleOpenLoginModal}>
              <Button size="s" type="filled-primary">
                로그인
              </Button>
            </div>
          )}
          {!hideBtn &&
            !isMobile &&
            isLoggedIn &&
            (isPostPage ? (
              <Link href="/board/write">
                <Button size="m" type="filled-primary">
                  글 쓰기
                </Button>
              </Link>
            ) : (
              <Link href="/write">
                <Button size="m" type="filled-primary">
                  그림 업로드
                </Button>
              </Link>
            ))}
          <div className={styles.icons}>
            <Link href="/search">
              <IconComponent name="search" size={24} padding={8} isBtn />
            </Link>

            {(!isMobile || !isTablet) && isLoggedIn && myData && (
              <div className={styles.notificationWrapper} ref={notificationRef}>
                <div className={styles.notification} onClick={handleToggleNotifications}>
                  <IconComponent name={name} size={40} isBtn />
                </div>
                {showNotifications && <Notifications onClose={handleCloseNotifications} />}
              </div>
            )}
          </div>

          {!isMobile ? (
            isLoggedIn && myData ? (
              <div className={styles.profileContact} ref={dropdownRef}>
                <div className={styles.profileSection}>
                  <div className={styles.profileContainer} onClick={handleToggleDropdown}>
                    <Image
                      src={myData.image || "/image/default.svg"}
                      width={28}
                      height={28}
                      alt="프로필 이미지"
                      className={styles.profileImage}
                      quality={50}
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                  {isDropdownOpen && (
                    <div className={styles.dropdown}>
                      <Link href={`/${myData.url}`}>
                        <div className={styles.dropdownItem} onClick={handleCloseDropdown}>
                          <Image
                            src={myData.image ?? "/image/default.svg"}
                            width={32}
                            height={32}
                            alt="프로필 이미지"
                            className={styles.profileImage}
                            quality={50}
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                          <span>내 프로필</span>
                        </div>
                      </Link>
                      <div className={styles.divider} />
                      <Link href="/mypage?tab=liked-feeds">
                        <div className={styles.dropdownItem} onClick={handleCloseDropdown}>
                          좋아요한 그림
                        </div>
                      </Link>
                      <Link href="/mypage?tab=saved-feeds">
                        <div className={styles.dropdownItem} onClick={handleCloseDropdown}>
                          저장한 그림
                        </div>
                      </Link>
                      <div className={styles.divider} />
                      <Link href="/mypage?tab=saved-posts">
                        <div className={styles.dropdownItem} onClick={handleCloseDropdown}>
                          저장한 글
                        </div>
                      </Link>
                      <div className={styles.divider} />
                      <div
                        className={`${styles.dropdownItem} ${styles.logout}`}
                        onClick={() => {
                          handleLogout();
                          handleCloseDropdown();
                        }}
                      >
                        로그아웃
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.uploadBtn} onClick={handleOpenLoginModal}>
                <Button size="m" type="filled-primary">
                  로그인
                </Button>
              </div>
            )
          ) : (
            <>
              <div onClick={toggleMenu}>
                <IconComponent name="hamburger" size={24} padding={8} isBtn />
              </div>
              <div
                className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    toggleMenu();
                  }
                }}
              >
                <div
                  className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.menuContentWrapper}>
                    <div className={styles.navUpload}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          closeMenu();
                        }}
                        className={styles.closeBtn}
                      >
                        <IconComponent name="x" size={24} isBtn />
                      </div>
                    </div>
                    {!isLoggedIn || !myData ? (
                      <>
                        <div
                          className={isMobile ? styles.uploadBtnContainer : styles.uploadBtn}
                          onClick={handleOpenLoginModal}
                        >
                          <Button size="m" type="filled-primary" width="200px">
                            로그인
                          </Button>
                        </div>
                        <nav className={styles.nav}>
                          {navItems.map((item, index) => (
                            <div
                              key={index}
                              className={styles.navItem}
                              onClick={() => {
                                handleNavClick(item);
                                closeMenu();
                              }}
                            >
                              <p
                                className={`${styles.item} ${
                                  isNavPage && (activeNav === item.name ? styles.active : "")
                                }`}
                              >
                                {item.name}
                              </p>
                            </div>
                          ))}
                        </nav>
                      </>
                    ) : (
                      <div className={styles.mobileProfile}>
                        <div
                          className={`${styles.profileSubmenu} ${
                            isSubMenuOpen ? styles.profileSubmenuOpen : ""
                          }`}
                        >
                          <Link
                            href={`/${myData?.url}`}
                            className={styles.mobileMyInfo}
                            onClick={closeMenu}
                          >
                            <Image
                              src={myData?.image || "/image/default.svg"}
                              width={32}
                              height={32}
                              alt="프로필 이미지"
                              className={styles.profileImage}
                              quality={50}
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                            <span className={styles.name}>{myData?.name}</span>
                          </Link>
                          <div
                            className={styles.submenu}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubmenu();
                            }}
                          >
                            <IconComponent name={isSubMenuOpen ? "menuUp" : "menuDown"} size={20} />
                          </div>
                        </div>
                        {isSubMenuOpen && (
                          <div className={styles.btns}>
                            <Link href="/mypage?tab=liked-feeds" onClick={closeMenu}>
                              <button className={styles.itemBtn}>
                                <IconComponent name="menuSave" size={18} isBtn />
                                저장한 컨텐츠
                              </button>
                            </Link>
                            <button
                              className={styles.itemBtn}
                              onClick={() => {
                                handleLogout();
                                closeMenu();
                              }}
                            >
                              <IconComponent name="menuLogout" size={18} isBtn />
                              로그아웃
                            </button>
                          </div>
                        )}
                        <div className={styles.uploadFeedBtn}>
                          <Link href="/write" onClick={closeMenu}>
                            <Button
                              size="m"
                              width="200px"
                              type="filled-primary"
                              leftIcon={<IconComponent name="menuUpload" size={16} isBtn />}
                            >
                              그림 업로드
                            </Button>
                          </Link>
                        </div>
                        <div className={styles.bar} />
                        <nav className={styles.nav}>
                          {navItems.map((item, index) => (
                            <div
                              key={index}
                              className={styles.navItem}
                              onClick={() => {
                                handleNavClick(item);
                                closeMenu();
                              }}
                            >
                              <p
                                className={`${styles.item} ${
                                  isNavPage && (activeNav === item.name ? styles.active : "")
                                }`}
                              >
                                {item.name}
                              </p>
                            </div>
                          ))}
                        </nav>
                      </div>
                    )}
                  </div>

                  <div className={styles.mobileFooterWrap}>
                    <FooterSection onClose={closeMenu} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
