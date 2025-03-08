import Title from "@/components/Layout/Title/Title";
import styles from "./PopularFeed.module.scss";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import FeedCard from "./FeedCard/FeedCard";
import { usePopularFeed } from "@/api/feeds/getPopular";
import { useRef, useEffect } from "react";
import Loader from "@/components/Layout/Loader/Loader";
import { useRouter } from "next/router";

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
        <Title>인기 그림</Title>
        <div className={styles.sortBtnContainer}>
          <button className={styles.sortBtn}>
            좋아요 순<IconComponent name="arrowDown" width={20} height={20} />
          </button>
        </div>
      </div>
      <section className={styles.feedContainer}>
        {data?.pages.map((page) => page.feeds.map((feed) => <FeedCard key={feed.id} {...feed} />))}
      </section>
      {hasNextPage && <div ref={loadMoreRef} />}
    </div>
  );
}
