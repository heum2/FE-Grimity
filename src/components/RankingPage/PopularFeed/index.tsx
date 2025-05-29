import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import Loader from "@/components/Layout/Loader/Loader";
import Title from "@/components/Layout/Title/Title";
import FeedCard from "@/components/RankingPage/PopularFeed";

import { usePopularFeed } from "@/api/feeds/getPopular";

import styles from "@/components/RankingPage/PopularFeed/PopularFeed.module.scss";

export default function PopularFeed() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    usePopularFeed();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
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
        <Title>인기 그림 순위</Title>
      </div>
      <section className={styles.feedContainer}>
        {data?.pages.map((page) => page.feeds.map((feed) => <FeedCard key={feed.id} {...feed} />))}
      </section>
      {hasNextPage && <div ref={loadMoreRef} />}
    </div>
  );
}
