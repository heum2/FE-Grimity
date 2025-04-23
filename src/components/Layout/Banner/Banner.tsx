import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./Banner.module.scss";
import Link from "next/link";
import { useDeviceStore } from "@/states/deviceStore";

export default function Banner() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  const noticeUrl = "/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a";
  const imageSrc = isMobile
    ? "/image/main-banner-m.png"
    : isTablet
    ? "/image/main-banner-t.png"
    : "/image/main-banner.png";

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
        <Link href={noticeUrl}>
          <img src={imageSrc} loading="lazy" className={styles.banner} />
        </Link>
      </SwiperSlide>
    </Swiper>
  );
}
