import styles from "./Chip.module.scss";
import { ChipProps } from "./Chip.types";

export default function Chip({
  children,
  type = "filled-primary",
  size = "m",
  unselected = false,
  leftIcon,
  rightIcon,
}: ChipProps) {
  const className = `${styles.chip} ${styles[type]} ${styles[size]} ${
    unselected ? styles.unselected : ""
  }`;

  return (
    <div className={className}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      {children}
      {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
    </div>
  );
}
