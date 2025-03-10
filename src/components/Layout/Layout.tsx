import React, { useEffect, useState } from "react";
import styles from "./Layout.module.scss";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.types";
import IconComponent from "../Asset/Icon";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRecoilValue } from "recoil";
import { isMobileState, isTabletState } from "@/states/isMobileState";

export default function Layout({ children }: LayoutProps) {
  const [isScrollAbove, setIsScrollAbove] = useState(false);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();

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
        {!isMobile && !isTablet && (
          <div
            className={`${styles.topButton} ${isScrollAbove && styles.show}`}
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
          >
            <IconComponent name="up" size={28} isBtn />
          </div>
        )}
      </div>
    </div>
  );
}
