import Title from "@/components/Layout/Title/Title";
import styles from "./PopularFeed.module.scss";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import FeedCard from "./FeedCard/FeedCard";
import { usePopularFeed } from "@/api/feeds/getPopular";
import { useRef, useEffect } from "react";
import Loader from "@/components/Layout/Loader/Loader";

export default function PopularFeed() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePopularFeed();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  if (isLoading) <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Title>인기 그림</Title>
        <div className={styles.sortBtn}>
          <Button
            size="l"
            type="text-assistive"
            rightIcon={<IconComponent name="arrowDown" width={20} height={20} />}
          >
            좋아요 순
          </Button>
        </div>
      </div>
      <section className={styles.feedContainer}>
        {data?.pages.map((page) => page.feeds.map((feed) => <FeedCard key={feed.id} {...feed} />))}
      </section>
      {hasNextPage && <div ref={loadMoreRef} />}
    </div>
  );
}
