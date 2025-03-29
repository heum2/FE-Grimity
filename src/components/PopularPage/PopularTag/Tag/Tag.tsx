import type { PopularTagResponse } from "@/api/tags/getTagsPopular";
import styles from "./Tag.module.scss";

export default function Tag({ tagName, thumbnail }: PopularTagResponse) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={thumbnail} alt="인기 태그 이미지" className={styles.image} loading="lazy" />
        <div className={styles.gradient} />
        <p className={styles.title}>{tagName}</p>
      </div>
    </div>
  );
}
