import Link from "next/link";
import clsx from "clsx";
import baseStyles from "../ButtonBase.module.scss";
import styles from "./TextButton.module.scss";
import { TextButtonProps } from "./TextButton.types";

export default function TextButton({
  variant = "primary",
  size = "regular",
  children,
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  onClick,
  onMouseDown,
  className,
  type = "button",
  href,
  "aria-label": ariaLabel,
}: TextButtonProps) {
  const classes = clsx(
    baseStyles.button,
    styles.text,
    styles[variant],
    styles[size],
    loading && baseStyles.loading,
    className,
  );

  const content = (
    <span className={baseStyles.content}>
      {iconLeft}
      {children}
      {iconRight}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      className={classes}
    >
      {loading && (
        <span className={clsx(baseStyles.spinner, size === "small" && baseStyles.spinnerSmall)} />
      )}
      {content}
    </button>
  );
}
