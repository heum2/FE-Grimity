import React, { useEffect, useState } from "react";
import styles from "./Layout.module.scss";
import Header from "./Header/Header";
import { useRouter } from "next/router";
import { LayoutProps } from "./Layout.types";

export default function Layout({ children }: LayoutProps) {
  const [isScrollAbove, setIsScrollAbove] = useState(false);
  const router = useRouter();

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrollAbove(true);
      } else {
        setIsScrollAbove(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.children}>
        <Header />
        {children}
        <div
          className={`${styles.topButton} ${isScrollAbove && styles.show}`}
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
}
