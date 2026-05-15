import { useRouter } from "next/navigation";

import { TitleProps } from "@/components/Layout/Title/Title.types";

import styles from "@/components/Layout/Title/Title.module.scss";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import clsx from "clsx";

export default function Title({ children, link, gap = "lg" }: TitleProps) {
  const router = useRouter();

  return (
    <div className={clsx(styles.container, styles[`gap-${gap}`])}>
      <h2 className={styles.title}>{children}</h2>
      {link && (
        <TextButton variant="assistive" size="large" onClick={() => router.push(link)}>더보기</TextButton>
      )}
    </div>
  );
}
