import type { PopularTagResponse } from "@/api/tags/getTagsPopular";
import styles from "./Tag.module.scss";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";

export default function Tag({ tagName, thumbnail }: PopularTagResponse) {
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const divRef = usePreventRightClick<HTMLDivElement>();
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper} ref={divRef}>
        <img
          src={thumbnail}
          alt="인기 태그 이미지"
          className={styles.image}
          loading="lazy"
          ref={imgRef}
        />
        <div className={styles.gradient} />
        <p className={styles.title}>{tagName}</p>
      </div>
    </div>
  );
}
