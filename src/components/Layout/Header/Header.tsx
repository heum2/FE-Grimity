import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "@/components/Button/Button";
import Link from "next/link";
import IconComponent from "@/components/Asset/Icon";

export default function Header() {
  const [activeNav, setActiveNav] = useState("홈");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "최신그림", path: "/new" },
    { name: "인기그림", path: "/popular" },
    { name: "자유게시판", path: "/board" },
    { name: "팔로잉", path: "/following" },
  ];

  const handleNavClick = (item: string) => {
    setActiveNav(item);
  };

  useEffect(() => {
    if (activeItemRef.current && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
      indicatorRef.current.style.width = `${offsetWidth}px`;
    }
  }, [activeNav]);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/">
          <div className={styles.cursor}>
            <Image src="/image/logo.svg" width={100} height={29} alt="logo" />
          </div>
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <Link key={index} href={item.path} passHref>
              <div className={styles.navItem} onClick={() => handleNavClick(item.name)}>
                <p
                  className={`${styles.item} ${activeNav === item.name ? styles.active : ""}`}
                  ref={item.name === activeNav ? activeItemRef : null}
                >
                  {item.name}
                </p>
                {index < navItems.length - 1 && <div className={styles.bar} />}
              </div>
            </Link>
          ))}
          <div ref={indicatorRef} className={styles.indicator} />
        </nav>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.icons}>
          <IconComponent name="search" width={24} height={24} padding={8} isBtn alt="검색" />
          <IconComponent name="bell" width={24} height={24} padding={8} isBtn alt="알림" />
        </div>
        <Link href="/write">
          <div className={styles.uploadBtn}>
            <Button size="m" type="filled-primary">
              작품 업로드
            </Button>
          </div>
        </Link>
      </div>
    </header>
  );
}
