import clsx from "clsx";

import TextButton from "@/components/common/Button/TextButton/TextButton";

import { TitleProps } from "@/components/Layout/Title/Title.types";

import styles from "@/components/Layout/Title/Title.module.scss";

export default function Title({ children, link, gap = "lg" }: TitleProps) {
  return (
    <div className={clsx(styles.container, styles[`gap-${gap}`])}>
      <h2 className={styles.title}>{children}</h2>
      {link && (
        <TextButton variant="assistive" size="large" href={link}>
          더보기
        </TextButton>
      )}
    </div>
  );
}
