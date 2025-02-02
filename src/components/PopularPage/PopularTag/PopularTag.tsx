import { useTagsPopular } from "@/api/tags/getTagsPopular";
import styles from "./PopularTag.module.scss";
import Title from "@/components/Layout/Title/Title";
import Loader from "@/components/Layout/Loader/Loader";
import Tag from "./Tag/Tag";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PopularTag() {
  const { data, isLoading } = useTagsPopular();

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>인기 태그</Title>
      <div className={styles.cardContainer}>
        <Swiper spaceBetween={16} slidesPerView="auto" grabCursor={true} className={styles.swiper}>
          {data?.map((tag) => (
            <SwiperSlide key={tag.tagName} className={styles.slide}>
              <Tag tagName={tag.tagName} thumbnail={tag.thumbnail} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.lastGradient} />
    </div>
  );
}
