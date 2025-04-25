import styles from "./Button.module.scss";
import { ButtonProps } from "./Button.types";

export default function Button({
  children,
  type = "filled-primary",
  size = "m",
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  width,
}: ButtonProps) {
  let className = `${styles.button} ${styles[type]} ${styles[size]}`;

  if (disabled) {
    className += ` ${styles.disabled}`;
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} style={{ width }}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      {children}
      {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
    </button>
  );
}
