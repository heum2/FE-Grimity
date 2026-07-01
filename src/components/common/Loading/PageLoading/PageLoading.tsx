import clsx from "clsx";

import RefreshLoading from "@/components/common/Loading/RefreshLoading/RefreshLoading";

import styles from "./PageLoading.module.scss";
import { PageLoadingProps } from "./PageLoading.types";

export default function PageLoading({
  title = "로딩 중이에요",
  description,
  className,
}: PageLoadingProps) {
  return (
    <div className={clsx(styles.card, className)} role="status" aria-live="polite">
      <RefreshLoading type="basic" size={40} />
      <div className={styles.textContainer}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
