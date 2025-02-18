import { TagsPopularResponse } from "@/api/tags/getTagsPopular";
import styles from "./Tag.module.scss";
import Image from "next/image";

export default function Tag({ tagName, thumbnail }: TagsPopularResponse) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image src={thumbnail} alt="인기 태그 이미지" className={styles.image} fill quality={75} />
        <div className={styles.gradient} />
        <p className={styles.title}>{tagName}</p>
      </div>
    </div>
  );
}
