import { useState } from "react";
import Title from "../Title/Title";
import styles from "./FollowNewFeed.module.scss";
import Loader from "../Loader/Loader";
import Image from "next/image";
import RectangleCard from "../RectangleCard/RectangleCard";
import { useFollowingNew } from "@/api/feeds/getFeedsFollowing";

export default function FollowNewFeed() {
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 2;

  const { data, isLoading } = useFollowingNew({ size: 8 });

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
        </>
      )}
    </div>
  );
}
