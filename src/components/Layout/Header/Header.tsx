import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "@/components/Button/Button";
import Link from "next/link";
import IconComponent from "@/components/Asset/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { authState } from "@/states/authState";
import { useMyData } from "@/api/users/getMe";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import Notifications from "@/components/Notifications/Notifications";
import { isMobileState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import Dropdown from "@/components/Dropdown/Dropdown";

export default function Header() {
  const [, setModal] = useRecoilState(modalState);
  const [, setAuth] = useRecoilState(authState);
  const { isLoggedIn } = useRecoilValue(authState);
  const { data: myData } = useMyData();
  const [activeNav, setActiveNav] = useState("홈");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const isMobile = useRecoilValue(isMobileState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isUserPage = router.pathname.startsWith("/users/[id]");
  const isNavPage = ["/", "/popular", "/board", "/following", "/board/write"].includes(
    router.pathname
  );
  const hideBtn = ["/write", "/feeds/[id]/edit"].includes(router.pathname);
  useIsMobile();

  const navItems = [
    { name: "홈", path: "/" },
    { name: "인기그림", path: "/popular" },
    { name: "자유게시판", path: "/board" },
    { name: "팔로잉", path: "/following" },
  ];

  let name: "bellWhiteActive" | "bellActive" | "bellWhite" | "bell";

  if (myData?.hasNotification && isUserPage) {
    name = "bellWhiteActive";
  } else if (myData?.hasNotification && !isUserPage) {
    name = "bellActive";
  } else if (!myData?.hasNotification && isUserPage) {
    name = "bellWhite";
  } else {
    name = "bell";
  }

  const handleNavClick = (item: { name: string; path: string }) => {
    setActiveNav(item.name);
    if (isMobile) setIsMenuOpen(false);

    if (router.pathname === item.path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(item.path);
    }
  };

  const handleLogout = () => {
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAuth({
      access_token: "",
      isLoggedIn: false,
      user_id: "",
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find(
      (item) =>
        currentPath === item.path || (item.path === "/board" && currentPath.startsWith("/board/"))
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        showNotifications
      ) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleClickLogo = () => {
    if (router.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleSearchBarOpen = () => {
    setIsSearchBarOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  usePreventScroll(isMenuOpen);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length < 2) {
        showToast("두 글자 이상 입력해주세요.", "warning");
        return;
      }
      let tab = "feed";
      if (router.pathname.includes("board")) {
        tab = "board";
      } else if (router.pathname.includes("posts")) {
        tab = "board";
      }
      router.push(`/search?tab=${tab}&keyword=${encodeURIComponent(trimmedKeyword)}`);
      setIsSearchBarOpen(false);
      setKeyword("");
    }
  };

  return (
    <header className={isUserPage ? styles.userPageHeader : styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.cursor} onClick={handleClickLogo}>
            <Image
              src={isUserPage ? "/image/logo-white.svg" : "/image/logo.svg"}
              width={100}
              height={29}
              alt="logo"
            />
          </div>
          {!isMobile && (
            <nav className={styles.nav}>
              {navItems.map((item, index) => (
                <div key={index} className={styles.navItem} onClick={() => handleNavClick(item)}>
                  <p
                    className={`${isUserPage ? styles.userPageitem : styles.item} ${
                      isNavPage && (activeNav === item.name ? styles.active : "")
                    }`}
                    ref={item.name === activeNav ? activeItemRef : null}
                  >
                    {item.name}
                  </p>
                  {index < navItems.length - 1 && <div className={styles.bar} />}
                </div>
              ))}
              {isNavPage && <div ref={indicatorRef} className={styles.indicator} />}
            </nav>
          )}
        </div>
        <div className={styles.wrapper}>
          {isMobile && !isLoggedIn && (
            <div
              className={styles.uploadBtn}
              onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
            >
              <Button size="s" type="filled-primary">
                로그인
              </Button>
            </div>
          )}
          <div className={styles.icons}>
            {!isMobile ? (
              isSearchBarOpen ? (
                <div className={styles.searchbarContainer}>
                  <input
                    placeholder="그림, 작가, 관련 작품을 검색해보세요"
                    className={styles.input}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <div onClick={handleSearchBarOpen}>
                    <IconComponent
                      name="searchGray"
                      width={24}
                      height={24}
                      padding={8}
                      isBtn
                      alt="검색"
                    />
                  </div>
                </div>
              ) : (
                <div onClick={handleSearchBarOpen}>
                  <IconComponent
                    name={isUserPage ? "searchWhite" : "search"}
                    width={24}
                    height={24}
                    padding={8}
                    isBtn
                    alt="검색"
                  />
                </div>
              )
            ) : (
              <Link href="/search">
                <IconComponent
                  name={isUserPage ? "searchWhite" : "search"}
                  width={24}
                  height={24}
                  padding={8}
                  isBtn
                  alt="검색"
                />
              </Link>
            )}
            {isLoggedIn && myData && (
              <div className={styles.notificationWrapper} ref={notificationRef}>
                <div className={styles.notification} onClick={toggleNotifications}>
                  <IconComponent name={name} width={40} height={40} alt="알림" isBtn />
                </div>
                {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
              </div>
            )}
          </div>
          {!isMobile ? (
            isLoggedIn && myData ? (
              <div className={styles.profileSection}>
                <div
                  className={styles.profileContainer}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {myData.image !== "https://image.grimity.com/null" ? (
                    <Image
                      src={myData.image}
                      width={100}
                      height={100}
                      alt="프로필 이미지"
                      className={styles.profileImage}
                      quality={100}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Image
                      src="/image/default.svg"
                      width={100}
                      height={100}
                      alt="프로필 이미지"
                      className={styles.profileImage}
                      quality={100}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                {isDropdownOpen && (
                  <div className={styles.dropdown} ref={dropdownRef}>
                    <Link href={`/users/${myData.id}`}>
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {myData.image !== "https://image.grimity.com/null" ? (
                          <Image
                            src={myData.image}
                            width={100}
                            height={100}
                            alt="프로필 이미지"
                            className={styles.dropdownProfileImage}
                            quality={100}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Image
                            src="/image/default.svg"
                            width={100}
                            height={100}
                            alt="프로필 이미지"
                            className={styles.dropdownProfileImage}
                            quality={100}
                            style={{ objectFit: "cover" }}
                          />
                        )}
                        <span>내 프로필</span>
                      </div>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/mypage?tab=liked-feeds">
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        좋아요한 그림
                      </div>
                    </Link>
                    <Link href="/mypage?tab=saved-feeds">
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        저장한 그림
                      </div>
                    </Link>
                    <Link href="/mypage?tab=saved-posts">
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        저장한 글
                      </div>
                    </Link>
                    <div className={styles.divider} />
                    <div
                      className={`${styles.dropdownItem} ${styles.logout}`}
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      로그아웃
                    </div>
                  </div>
                )}
                {!hideBtn && (
                  <Link href="/write">
                    <Button size="m" type="filled-primary">
                      그림 업로드
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div
                className={styles.uploadBtn}
                onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
              >
                <Button size="m" type="filled-primary">
                  로그인
                </Button>
              </div>
            )
          ) : (
            <>
              <div onClick={toggleMenu}>
                <IconComponent
                  name={isUserPage ? "hamburgerWhite" : "hamburger"}
                  width={24}
                  height={24}
                  padding={8}
                  isBtn
                />
              </div>
              <div
                className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
                onClick={toggleMenu}
              >
                <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}>
                  <div className={styles.navs}>
                    <nav className={styles.nav}>
                      {navItems.map((item, index) => (
                        <div
                          key={index}
                          className={styles.navItem}
                          onClick={() => handleNavClick(item)}
                        >
                          <p
                            className={`${isUserPage ? styles.userPageitem : styles.item} ${
                              isNavPage && (activeNav === item.name ? styles.active : "")
                            }`}
                          >
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </nav>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu();
                      }}
                    >
                      <IconComponent name="x" width={24} height={24} padding={8} isBtn />
                    </div>
                  </div>
                  {!isLoggedIn || !myData ? (
                    <div
                      className={styles.uploadBtn}
                      onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
                    >
                      <Button size="l" type="filled-primary">
                        로그인
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.mobileProfile}>
                      <Link href={`/users/${myData.id}`}>
                        {myData.image !== "https://image.grimity.com/null" ? (
                          <Image
                            src={myData.image}
                            width={100}
                            height={100}
                            alt="프로필 이미지"
                            className={styles.profileImage}
                            quality={100}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Image
                            src="/image/default.svg"
                            width={100}
                            height={100}
                            alt="프로필 이미지"
                            className={styles.profileImage}
                            quality={100}
                            style={{ objectFit: "cover" }}
                          />
                        )}
                        <span className={styles.name}>{myData.name}</span>
                      </Link>
                      <div className={styles.btns}>
                        <Link href="/mypage?tab=liked-feeds">
                          <Button
                            size="m"
                            type="outlined-assistive"
                            leftIcon={
                              <IconComponent name="bookmark" width={16} height={16} isBtn />
                            }
                          >
                            저장한 컨텐츠
                          </Button>
                        </Link>
                        <div className={styles.mobileDropdown} onClick={(e) => e.stopPropagation()}>
                          <Dropdown
                            isTopItem
                            trigger={
                              <div className={styles.itemBtn}>
                                <Image
                                  src="/icon/meatball.svg"
                                  width={20}
                                  height={20}
                                  alt="메뉴 버튼 "
                                />
                              </div>
                            }
                            menuItems={[
                              {
                                label: "로그아웃",
                                onClick: handleLogout,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
