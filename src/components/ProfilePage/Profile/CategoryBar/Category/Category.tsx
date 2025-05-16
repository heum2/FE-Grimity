import styles from "./Category.module.scss";
import { CategoryProps } from "./Category.types";

export default function Category({ children, type, onClick, unselected, quantity }: CategoryProps) {
  const isUnselected = unselected ?? type === "unselect";
  const className = `${styles.category} ${styles[type]} ${isUnselected ? styles.unselected : ""}`;

  return (
    <span className={className} onClick={onClick}>
      {children}
      {quantity !== undefined && <span className={styles.quantity}>{quantity}</span>}
    </span>
  );
}
