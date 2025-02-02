import { TitleProps } from "./Title.types";
import styles from "./Title.module.scss";
import Link from "next/link";

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
