import { useEffect, useRef } from "react";
import { useFollowingFeeds } from "@/api/feeds/getFeedsFollowing";
import styles from "./FollowingPage.module.scss";
import FollowingFeed from "./FollowingFeed/FollowingFeed";
import Loader from "../Layout/Loader/Loader";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "@/states/authState";
import { modalState } from "@/states/modalState";

export default function FollowingPage() {
  const { isLoggedIn } = useRecoilValue(authState);
  const setModal = useSetRecoilState(modalState);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = isLoggedIn
    ? useFollowingFeeds({ size: 3 })
    : {
        data: null,
        isLoading: false,
        fetchNextPage: () => {},
        hasNextPage: false,
        isFetchingNextPage: false,
      };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastFeedElement = useRef<HTMLDivElement | null>(null);

  if (!isLoggedIn) {
    setModal({ isOpen: true, type: "LOGIN" });
    return null;
  }

  useEffect(() => {
    if (lastFeedElement.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );
      observer.current.observe(lastFeedElement.current);
    }

    return () => {
      if (observer.current && lastFeedElement.current) {
        observer.current.unobserve(lastFeedElement.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <Loader />;

  const isEmpty =
    !data || data.pages.length === 0 || data.pages.every((page) => page.feeds.length === 0);

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        {isEmpty ? (
          <p className={styles.message}>팔로잉하는 유저가 없어요</p>
        ) : (
          <div className={styles.feedsContainer}>
            {data.pages.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.feeds.map((feed) => (
                  <FollowingFeed key={feed.id} id={feed.id} />
                ))}
              </div>
            ))}
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={lastFeedElement}></div>}
      </div>
    </div>
  );
}
