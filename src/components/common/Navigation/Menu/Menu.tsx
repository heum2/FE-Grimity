import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Divider from "@/components/common/Divider/Divider";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Menu.module.scss";
import { MenuProps } from "./Menu.types";

export default function Menu({
  items,
  trigger,
  align = "right",
  className,
  wrapperClassName,
  open: openProp,
  onOpenChange,
  disabled = false,
}: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const closeMenu = () => {
    if (trigger) setOpen(false);
  };

  const list = (
    <ul className={clsx(styles.menu, className)} role="menu">
      {items.map((item, i) => (
        <React.Fragment key={item.label ?? i}>
          <li
            role="menuitem"
            tabIndex={0}
            className={clsx(styles.item, item.selected && styles.itemSelected)}
            onClick={() => {
              item.onClick?.();
              closeMenu();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.onClick?.();
                closeMenu();
              }
            }}
          >
            <span>{item.label}</span>
            {item.selected ? (
              <Icon name="check" size={20} color="primary-normal" aria-hidden />
            ) : null}
          </li>
          {item.borderBottom && (
            <li role="separator" className={styles.divider}>
              <Divider variant="secondary" />
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );

  if (!trigger) return list;

  if (disabled) {
    return <div className={clsx(styles.wrapper, wrapperClassName)}>{trigger}</div>;
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, wrapperClassName)}>
      <div className={styles.triggerWrap} onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && <div className={clsx(styles.menuContainer, styles[align])}>{list}</div>}
    </div>
  );
}
