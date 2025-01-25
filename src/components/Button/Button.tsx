import { useState } from "react";
import styles from "./Button.module.scss";
import { ButtonProps } from "./Button.types";
import Image from "next/image";

export default function Button({
  children,
  type = "filled-primary",
  size = "m",
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  let className = `${styles.button} ${styles[type]} ${styles[size]}`;

  if (disabled) {
    className += ` ${styles.disabled}`;
  }

  const handleClick = () => {
    if (onClick) onClick();
    if (type === "text-assistive") {
      setIsOpen((prev) => !prev); // 'text-assistive' 타입일 경우만 토글
    }
  };

  return (
    <button className={className} disabled={disabled} onClick={handleClick}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      {children}
      {rightIcon && (
        <div
          className={`${styles.icon} ${isOpen ? styles.open : ""}`}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <Image src={rightIcon} alt="아이콘" width={20} height={20} />
        </div>
      )}
    </button>
  );
}
