import { useState } from "react";
import SquareCard from "../SquareCard/SquareCard";
import Title from "../Title/Title";
import IconComponent from "@/components/Asset/Icon";
import styles from "./Ranking.module.scss";
import { useTodayFeedPopular } from "@/api/feeds/getTodayPopular";
import Loader from "../Loader/Loader";
import Image from "next/image";

export default function Ranking() {
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading } = useTodayFeedPopular();

  if (isLoading) return <Loader />;

  const itemsPerPage = 3;
  const startIdx = pageIndex * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedFeeds = data?.slice(startIdx, endIdx) || [];
  const isEmpty = !data || data.length === 0;

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (endIdx < (data?.length || 0) && pageIndex < 3) setPageIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <Title link="/popular">오늘의 인기 랭킹</Title>
      {isEmpty ? (
        <p className={styles.message}>아직 등록된 그림이 없어요</p>
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
            <Image
              src="/icon/card-arrow-left.svg"
              width={40}
              height={40}
              alt="왼쪽 버튼"
              className={styles.arrowBtn}
            />
          </button>
          <div className={styles.cardsContainer}>
            {paginatedFeeds.map((feed, idx) => (
              <div key={feed.id} className={styles.cardWrapper}>
                {startIdx + idx < 3 && (
                  <div className={styles.rankingIconWrapper}>
                    <IconComponent
                      name={
                        startIdx + idx === 0
                          ? "ranking1"
                          : startIdx + idx === 1
                          ? "ranking2"
                          : "ranking3"
                      }
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
            disabled={endIdx >= (data?.length || 0) || pageIndex === 3}
            style={{
              visibility: pageIndex === 3 ? "hidden" : "visible",
            }}
          >
            <Image
              src="/icon/card-arrow-right.svg"
              width={40}
              height={40}
              alt="오른쪽 버튼"
              className={styles.arrowBtn}
            />
          </button>
        </div>
      )}
    </div>
  );
}
