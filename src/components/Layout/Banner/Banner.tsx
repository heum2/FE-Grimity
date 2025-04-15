import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./Banner.module.scss";
import Link from "next/link";
import { useDeviceStore } from "@/states/deviceStore";
import { baseUrl } from "@/constants/baseurl";

export default function Banner() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  let mainBanner;

  if (isMobile) {
    mainBanner = (
      <Link href={`${baseUrl}/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a`}>
        <img src="/image/main-banner-m.png" loading="lazy" className={styles.banner} />
      </Link>
    );
  } else if (isTablet) {
    mainBanner = (
      <Link href={`${baseUrl}/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a`}>
        <img src="/image/main-banner-t.png" loading="lazy" className={styles.banner} />
      </Link>
    );
  } else {
    mainBanner = (
      <Link href={`${baseUrl}/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a`}>
        <img src="/image/main-banner.png" loading="lazy" className={styles.banner} />
      </Link>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className={styles.bannerSwiper}
    >
      <SwiperSlide>{mainBanner}</SwiperSlide>
    </Swiper>
  );
}
