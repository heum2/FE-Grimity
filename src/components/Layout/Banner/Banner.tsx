import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./Banner.module.scss";
import Link from "next/link";

export default function Banner() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className={styles.bannerSwiper}
    >
      <SwiperSlide>
        <Link href="https://www.grimity.com/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a">
          <img src="/image/banner1.png" loading="lazy" className={styles.banner} />
        </Link>
      </SwiperSlide>
      <SwiperSlide>
        <Link href="https://www.grimity.com/posts/f3ee6b5b-2db6-4d85-98ad-3be95ef8d093">
          <img src="/image/banner2.png" loading="lazy" className={styles.banner} />
        </Link>
      </SwiperSlide>
    </Swiper>
  );
}
