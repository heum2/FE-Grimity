import { TitleProps } from "./Title.types";
import styles from "./Title.module.scss";

export default function Title({ children }: TitleProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{children}</h2>
      <p className={styles.btn}>더보기</p>
    </div>
  );
}
