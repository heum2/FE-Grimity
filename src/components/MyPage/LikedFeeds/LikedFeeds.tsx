import IconComponent from "@/components/Asset/Icon";
import styles from "./LikedFeeds.module.scss";
import { useMyLikeList } from "@/api/users/getMeLikeFeeds";
import Button from "@/components/Button/Button";
import ProfileCard from "@/components/Layout/ProfileCard/ProfileCard";
import { useEffect, useRef } from "react";

export default function LikedFeeds() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyLikeList({
    size: 20,
  });
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className={styles.btnContainer}>
        <Button
          type="text-assistive"
          size="l"
          rightIcon={<IconComponent name="arrowDown" width={20} height={20} isBtn />}
        >
          최신순
        </Button>
      </div>
      <section className={styles.cardContainer}>
        {data &&
          data.pages.flat().map((page) =>
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
            ))
          )}
      </section>
      <div ref={observerRef} />
    </>
  );
}
