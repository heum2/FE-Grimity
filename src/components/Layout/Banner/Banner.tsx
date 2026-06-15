import Link from "next/link";

import styles from "@/components/Layout/Banner/Banner.module.scss";

function Banner() {
  const noticeUrl = "/posts/2793deed-2267-481f-867f-dc6c6d3d05da";

  return (
    <Link href={noticeUrl}>
      <picture>
        <source
          width={358}
          height={100}
          media="(max-width: 767px)"
          srcSet="/image/main-banner-m.webp"
        />
        <source
          width={880}
          height={120}
          media="(max-width: 1023px)"
          srcSet="/image/main-banner-t.webp"
        />
        <img
          src="/image/main-banner.webp"
          width={1462}
          height={120}
          className={styles.banner}
          alt="메인 배너"
        />
      </picture>
    </Link>
  );
}

export default Banner;
