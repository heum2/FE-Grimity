import { useFeedsLatest } from "@/api/feeds/getFeedsLatest";
import SquareCard from "../SquareCard/SquareCard";
import Title from "../Title/Title";
import styles from "./NewFeed.module.scss";
import { useEffect, useRef } from "react";
import { NewFeedProps } from "./NewFeed.types";

export default function NewFeed({ isDetail = false }: NewFeedProps) {
  const { feeds, fetchFeedsLatest, isLoading, hasMore } = useFeedsLatest({
    size: 20,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchFeedsLatest();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading, fetchFeedsLatest]);

  return (
    <div className={styles.container}>
      {isDetail ? <Title>추천 작품</Title> : <Title>최신 그림</Title>}
      <div className={styles.grid}>
        {feeds.map((feed) => (
          <SquareCard
            key={feed.id}
            id={feed.id}
            title={feed.title}
            thumbnail={feed.thumbnail}
            author={feed.author}
            likeCount={feed.likeCount}
            viewCount={feed.viewCount}
            isLike={feed.isLike}
          />
        ))}
      </div>
      <div ref={observerRef} className={styles.loader} />
    </div>
  );
}
