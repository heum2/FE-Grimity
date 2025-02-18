import { useEffect, useState } from "react";
import Title from "../Title/Title";
import styles from "./FollowNewFeed.module.scss";
import Loader from "../Loader/Loader";
import RectangleCard from "../RectangleCard/RectangleCard";
import { useFollowingNew } from "@/api/feeds/getFeedsFollowing";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRecoilValue } from "recoil";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function FollowNewFeed() {
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 2;
  useIsMobile();
  const { data, isLoading, refetch } = useFollowingNew({ size: 8 });
  const { pathname } = useRouter();

  useEffect(() => {
    refetch();
  }, [pathname]);

  if (isLoading) return <Loader />;

  const startIdx = pageIndex * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedFeeds = data?.feeds?.slice(startIdx, endIdx) || [];

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (data?.feeds && endIdx < data.feeds.length) setPageIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      {data?.feeds?.length === 0 ? (
        <>
          <Title>팔로우하는 유저의 새 그림</Title>
          <p className={styles.message}>팔로우하는 유저가 없어요</p>
        </>
      ) : (
        <>
          <Title link="/following">팔로우하는 유저의 새 그림</Title>
          {!isMobile && isTablet && (
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              className={styles.rankingContainer}
            >
              {data?.feeds.map((feed) => (
                <SwiperSlide key={feed.id} className={styles.swiperSlide}>
                  <RectangleCard
                    id={feed.id}
                    title={feed.title}
                    content={feed.content}
                    thumbnail={feed.thumbnail}
                    author={feed.author}
                    likeCount={feed.likeCount}
                    commentCount={feed.commentCount}
                    createdAt={feed.createdAt}
                    isLike={feed.isLike}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {!isTablet && !isMobile && (
            <>
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
                  {paginatedFeeds.map((feed) => (
                    <div key={feed.id} className={styles.cardWrapper}>
                      <RectangleCard
                        id={feed.id}
                        title={feed.title}
                        content={feed.content}
                        thumbnail={feed.thumbnail}
                        author={feed.author}
                        likeCount={feed.likeCount}
                        commentCount={feed.commentCount}
                        createdAt={feed.createdAt}
                        isLike={feed.isLike}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className={`${styles.navButton} ${styles.right}`}
                  onClick={handleNextClick}
                  disabled={endIdx >= (data?.feeds?.length || 0)}
                  style={{
                    visibility: endIdx >= (data?.feeds?.length || 0) ? "hidden" : "visible",
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
            </>
          )}
          {isMobile && (
            <>
              <div className={styles.mobileCard}>
                <RectangleCard
                  id={paginatedFeeds[0].id}
                  title={paginatedFeeds[0].title}
                  content={paginatedFeeds[0].content}
                  thumbnail={paginatedFeeds[0].thumbnail}
                  author={paginatedFeeds[0].author}
                  likeCount={paginatedFeeds[0].likeCount}
                  commentCount={paginatedFeeds[0].commentCount}
                  createdAt={paginatedFeeds[0].createdAt}
                  isLike={paginatedFeeds[0].isLike}
                />
                <div className={styles.gradient} />
              </div>
              <Link href="/following">
                <div className={styles.showMore}>
                  <Button size="l" type="outlined-assistive">
                    더보기
                  </Button>
                </div>
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}
