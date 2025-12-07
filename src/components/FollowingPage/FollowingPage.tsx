import { useEffect, useRef, useState, useCallback } from "react";

import { useFollowingFeeds } from "@/api/feeds/getFeedsFollowing";
import { useUserData } from "@/api/users/getId";
import { PopularUserResponse, usePopular } from "@/api/users/getPopular";

import Loader from "@/components/Layout/Loader/Loader";
import Title from "@/components/Layout/Title/Title";
import FollowingFeed from "@/components/FollowingPage/FollowingFeed/FollowingFeed";
import RecommendCard from "@/components/FollowingPage/RecommendCard/RecommendCard";

import { useAuthStore } from "@/states/authStore";

import styles from "@/components/FollowingPage/FollowingPage.module.scss";

export default function FollowingPage() {
  const [randomUsers, setRandomUsers] = useState<PopularUserResponse[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  const user_id = useAuthStore((state) => state.user_id);

  const { data: myData, isLoading: isUserDataLoading } = useUserData(user_id);
  const { data: recommendData, isLoading: recommendIsLoading } = usePopular();

  const {
    data: feedData,
    isLoading: isFeedLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowingFeeds({ size: 3 }, myData && myData.followingCount > 0);

  const lastFeedElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "0px 0px 400px 0px" },
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  useEffect(() => {
    if (recommendData) {
      const randomData = [...recommendData].sort(() => Math.random() - 0.5).slice(0, 8);
      setRandomUsers(randomData);
    }
  }, [recommendData]);

  const isLoading = isUserDataLoading || recommendIsLoading || isFeedLoading;

  if (isUserDataLoading) return <Loader />;

  if (isLoading || recommendIsLoading) return <Loader />;

  const isFeedEmpty =
    !feedData ||
    feedData.pages.length === 0 ||
    feedData.pages.every((page) => page.feeds?.length === 0);

  const isFollowingEmpty = myData?.followingCount === 0;

  return (
    <div className={styles.container}>
      {isFollowingEmpty ? (
        // 팔로잉 유저가 없을 경우
        <div className={styles.emptyContainer}>
          <section className={styles.messageContainer}>
            <p className={styles.message}>아직 팔로우하는 작가가 없네요!</p>
            <p className={styles.submessage}>
              관심 있는 작가를 팔로우하고, 새로운 작품 소식을 받아보세요.
            </p>
          </section>
          <section className={styles.recommendContainer}>
            <Title>추천 작가</Title>
            <div className={styles.cards}>
              {randomUsers.map(
                (user) =>
                  user.id !== user_id && (
                    <RecommendCard
                      key={user.id}
                      id={user.id}
                      url={user.url}
                      name={user.name}
                      image={user.image}
                      description={user.description}
                      followerCount={user.followerCount}
                      isFollowing={user.isFollowing}
                      thumbnails={user.thumbnails}
                      isBlocking={user.isBlocking}
                      isBlocked={user.isBlocked}
                    />
                  ),
              )}
            </div>
          </section>
        </div>
      ) : isFeedEmpty ? (
        // 팔로잉 유저는 있지만 피드가 없을 경우
        <div className={styles.emptyContainer}>
          <section className={styles.messageContainer}>
            <p className={styles.message}>아직 올라온 그림이 없어요!</p>
            <p className={styles.submessage}>
              관심 있는 작가를 팔로우하고 새로운 작품 소식을 받아보세요
            </p>
          </section>
          <section className={styles.recommendContainer}>
            <Title>추천 작가</Title>
            <div className={styles.cards}>
              {randomUsers.map(
                (user) =>
                  user.id !== user_id && (
                    <RecommendCard
                      key={user.id}
                      id={user.id}
                      url={user.url}
                      name={user.name}
                      image={user.image}
                      description={user.description}
                      followerCount={user.followerCount}
                      isFollowing={user.isFollowing}
                      thumbnails={user.thumbnails}
                      isBlocking={user.isBlocking}
                      isBlocked={user.isBlocked}
                    />
                  ),
              )}
            </div>
          </section>
        </div>
      ) : (
        // 팔로잉 유저가 있고 피드도 있을 경우
        <div className={styles.center}>
          <div className={styles.feedsContainer}>
            {feedData.pages.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.feeds.map((feed) => (
                  <FollowingFeed
                    key={feed.id}
                    id={feed.id}
                    commentCount={feed.commentCount}
                    details={feed}
                  />
                ))}
              </div>
            ))}
          </div>
          {hasNextPage && <div ref={lastFeedElement} />}
        </div>
      )}
    </div>
  );
}
