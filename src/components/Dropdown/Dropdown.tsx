import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import styles from "./Dropdown.module.scss";
import { DropdownProps } from "./Dropdown.types";
import { useDeviceStore } from "@/states/deviceStore";

export default function Dropdown({
  menuItems,
  trigger,
  onOpenChange,
  isTopItem,
  isSide,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useDeviceStore();

  const onOpenChangeRef = useRef(onOpenChange);
  useLayoutEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChangeRef.current?.(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      onOpenChangeRef.current?.(newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  const getMenuClassName = () => {
    if (isTopItem) return styles.topMenu;
    if (isMobile || isTablet) return styles.mobileMenu;
    if (isSide) return styles.isSideMenu;
    return styles.menu;
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div onClick={handleToggle}>{trigger}</div>
      {isOpen && (
        <ul className={getMenuClassName()}>
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={item.isDelete ? styles.deleteItem : styles.menuItem}
              onClick={() => {
                item.onClick();
                handleClose();
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
