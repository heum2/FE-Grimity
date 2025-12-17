import { JSX, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";

import { useFeedsLatest } from "@/api/feeds/getFeedsLatest";
import { useDeviceStore } from "@/states/deviceStore";

import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import Title from "@/components/Layout/Title/Title";
import InFeedAd from "@/components/Layout/AdSense/InFeedAd";

import { NewFeedProps } from "@/components/Layout/NewFeed/NewFeed.types";

import styles from "./NewFeed.module.scss";

export default function NewFeed({ isDetail = false }: NewFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeedsLatest({
    size: 20,
  });
  const { isMobile, isTablet } = useDeviceStore();

  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  const feedsWithAds = useMemo(() => {
    if (!data?.pages) return null;

    const allFeeds = data.pages.flatMap((page) => page.feeds);
    const items: JSX.Element[] = [];

    const adPosition = isMobile ? 4 : isTablet ? 12 : 8;

    allFeeds.forEach((feed, index) => {
      // 피드 카드 추가
      items.push(
        <SquareCard
          key={feed.id}
          id={feed.id}
          title={feed.title}
          thumbnail={feed.thumbnail}
          author={feed.author}
          likeCount={feed.likeCount}
          viewCount={feed.viewCount}
          isLike={feed.isLike}
        />,
      );

      if (index + 1 === adPosition && allFeeds.length > adPosition) {
        items.push(<InFeedAd key="infeed-ad" />);
      }
    });

    return items;
  }, [data?.pages, isMobile, isTablet]);

  return (
    <div className={styles.container}>
      {isDetail ? <Title>추천 작품</Title> : <Title>최신 그림</Title>}
      <div className={styles.grid}>{feedsWithAds}</div>
      {hasNextPage && <div ref={observerRef} className={styles.loader} />}
    </div>
  );
}
