import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";
import { DropdownProps } from "./Dropdown.types";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useRecoilValue } from "recoil";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Dropdown({
  menuItems,
  trigger,
  onOpenChange,
  isTopItem,
  isSide,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();

  const toggleDropdown = (newState: boolean) => {
    setIsOpen(newState);
    if (onOpenChange) {
      onOpenChange(newState);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div onClick={() => toggleDropdown(!isOpen)} className={styles.trigger}>
        {trigger}
      </div>
      {isOpen && (
        <ul
          className={
            isTopItem
              ? styles.topMenu
              : isMobile || isTablet
              ? styles.mobileMenu
              : isSide
              ? styles.isSideMenu
              : styles.menu
          }
        >
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={item.isDelete ? styles.deleteItem : styles.menuItem}
              onClick={() => {
                item.onClick();
                toggleDropdown(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
