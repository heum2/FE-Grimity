import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { FOOTER_ITEMS } from "@/constants/footer";

import SidebarFooterItem, {
  FooterIconName,
} from "@/components/Layout/Sidebar/SidebarFooterItem/SidebarFooterItem";

import { useToast } from "@/hooks/useToast";

import styles from "@/components/Layout/FooterSection/FooterSection.module.scss";

interface FooterSectionProps {
  onClose?: () => void;
}

function FooterSection({ onClose }: FooterSectionProps) {
  const [isAskDropdownOpen, setIsAskDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const email = "grimity.official@gmail.com";

  const handleFooterClick = (itemIcon: FooterIconName, route?: string) => {
    if (route) {
      onClose?.();
      window.location.href = route;
    } else if (itemIcon === "ask") {
      setIsAskDropdownOpen(!isAskDropdownOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("이메일이 복사되었습니다!", "success");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      showToast("복사에 실패했습니다.", "success");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAskDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.footer}>
      <div className={styles.footerItems}>
        {FOOTER_ITEMS.map((item, index) => (
          <SidebarFooterItem
            key={index}
            icon={item.icon as FooterIconName}
            label={item.label}
            onClickItem={() => handleFooterClick(item.icon, item.route)}
            isHaveDropdown={item.isHaveDropdown}
            isDropdownOpen={item.icon === "ask" ? isAskDropdownOpen : false}
          />
        ))}
      </div>
      {isAskDropdownOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <Link
            href="https://open.kakao.com/o/sKYFewgh"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            카카오톡으로 문의하기
          </Link>
          <button
            onClick={() => {
              copyToClipboard();
              onClose?.();
            }}
            className={styles.dropdownItem}
          >
            메일로 보내기
          </button>
        </div>
      )}
      <div className={styles.subLinkWrapper}>
        <div className={styles.subLink}>
          <Link
            href="https://nostalgic-patch-498.notion.site/1930ac6bf29881e9a3e4c405e7f49f2b?pvs=73"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            이용약관
          </Link>
          <Link
            href="https://nostalgic-patch-498.notion.site/1930ac6bf29881b9aa19ff623c69b8e6?pvs=74"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            개인정보취급방침
          </Link>
        </div>
        <p>© Grimity. All rights reserved.</p>
      </div>
    </div>
  );
}

export default FooterSection;
