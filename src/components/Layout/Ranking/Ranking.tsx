import { useEffect, useState } from "react";
import SquareCard from "../SquareCard/SquareCard";
import Title from "../Title/Title";
import IconComponent from "@/components/Asset/Icon";
import styles from "./Ranking.module.scss";
import { useTodayFeedPopular } from "@/api/feeds/getTodayPopular";
import Loader from "../Loader/Loader";
import { useRecoilValue } from "recoil";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/router";

export default function Ranking() {
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading, refetch } = useTodayFeedPopular();
  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  if (isLoading) return <Loader />;

  const itemsPerPage = 3;
  const totalSlides = Math.ceil((data?.length || 0) / itemsPerPage);
  const paginatedFeeds = data || [];
  const isEmpty = !data || data.length === 0;

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (pageIndex < totalSlides - 1) setPageIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <Title link="/popular">오늘의 인기 랭킹</Title>
      {isEmpty ? (
        <p className={styles.message}>아직 등록된 그림이 없어요</p>
      ) : isMobile || isTablet ? (
        <div className={styles.rankingContainer}>
          <Swiper
            spaceBetween={12}
            slidesPerView={isMobile ? 1.5 : 3}
            onSlideChange={(swiper) => setPageIndex(swiper.activeIndex)}
          >
            {paginatedFeeds.map((feed, idx) => (
              <SwiperSlide key={feed.id}>
                <div className={styles.cardWrapper}>
                  {idx < 3 && (
                    <div className={styles.rankingIconWrapper}>
                      <IconComponent
                        name={idx === 0 ? "ranking1" : idx === 1 ? "ranking2" : "ranking3"}
                        width={30}
                        height={30}
                      />
                    </div>
                  )}
                  <SquareCard
                    id={feed.id}
                    title={feed.title}
                    thumbnail={feed.thumbnail}
                    author={feed.author}
                    likeCount={feed.likeCount}
                    viewCount={feed.viewCount}
                    isLike={feed.isLike}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={styles.rankingContainer}>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrevClick}
            disabled={pageIndex === 0}
            style={{
              visibility: pageIndex === 0 ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-left.svg"
              width={40}
              height={40}
              alt="왼쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>
          <div className={styles.cardsContainer}>
            {paginatedFeeds
              .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
              .map((feed, idx) => (
                <div key={feed.id} className={styles.cardWrapper}>
                  {idx < 3 && (
                    <div className={styles.rankingIconWrapper}>
                      <IconComponent
                        name={idx === 0 ? "ranking1" : idx === 1 ? "ranking2" : "ranking3"}
                        width={30}
                        height={30}
                      />
                    </div>
                  )}
                  <SquareCard
                    id={feed.id}
                    title={feed.title}
                    thumbnail={feed.thumbnail}
                    author={feed.author}
                    likeCount={feed.likeCount}
                    viewCount={feed.viewCount}
                    isLike={feed.isLike}
                  />
                </div>
              ))}
          </div>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNextClick}
            disabled={pageIndex === totalSlides - 1}
            style={{
              visibility: pageIndex === totalSlides - 1 ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-right.svg"
              width={40}
              height={40}
              alt="오른쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>
        </div>
      )}
    </div>
  );
}
