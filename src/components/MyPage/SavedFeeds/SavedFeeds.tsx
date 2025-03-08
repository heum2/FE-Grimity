import Button from "@/components/Button/Button";
import styles from "./SavedFeeds.module.scss";
import { useMySaveList } from "@/api/users/getMeSaveFeeds";
import ProfileCard from "@/components/Layout/ProfileCard/ProfileCard";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function SavedFeeds() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMySaveList({
    size: 20,
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isEmpty = !data || !data.pages || data.pages.every((page) => page.feeds.length === 0);

  return (
    <>
      {isEmpty ? (
        <div className={styles.noResult}>
          아직 저장한 그림이 없어요
          <Link href="/popular">
            <Button size="m" type="filled-primary">
              인기그림 둘러보기
            </Button>
          </Link>
        </div>
      ) : (
        <section className={styles.cardContainer}>
          {data.pages.flat().map((page) =>
            page.feeds.map((feed, index) => (
              <div key={`${feed.id}-${index}`}>
                <ProfileCard
                  title={feed.title}
                  cards={feed.cards}
                  thumbnail={feed.thumbnail}
                  likeCount={feed.likeCount}
                  commentCount={feed.commentCount}
                  createdAt={feed.createdAt}
                  id={feed.id}
                />
              </div>
            )),
          )}
        </section>
      )}
      <div ref={observerRef} />
    </>
  );
}
