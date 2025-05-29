import Link from "next/link";

import { TitleProps } from "@/components/Layout/Title/Title.types";

import styles from "@/components/Layout/Title/Title.module.scss";

export default function Title({ children, link }: TitleProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{children}</h2>
      {link && (
        <Link href={link}>
          <p className={styles.btn}>더보기</p>
        </Link>
      )}
    </div>
  );
}
