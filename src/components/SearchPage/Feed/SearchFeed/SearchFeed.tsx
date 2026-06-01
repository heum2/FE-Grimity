import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useFeedSearch } from "@/api/feeds/getFeedsSearch";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";
import SearchHighlightText from "@/components/SearchPage/SearchHighlightText/SearchHighlightText";
import { resolveSortOption } from "@/components/SearchPage/searchPage.constants";

import type { SearchedFeedsResponse } from "@grimity/dto";

import styles from "./SearchFeed.module.scss";

type SearchFeedItemData = SearchedFeedsResponse["feeds"][number];

type SearchFeedItemProps = {
  feed: SearchFeedItemData;
  keyword: string;
  isLoggedIn: boolean;
  onLikeClick: (id: string, isLiked: boolean) => void;
};

function SearchFeedItem({ feed, keyword, isLoggedIn, onLikeClick }: SearchFeedItemProps) {
  const isLiked = feed.isLike ?? false;

  return (
    <Link href={`/feeds/${feed.id}`} className={styles.cardLink}>
      <Album
        variant="mainTitle"
        imageUrl={feed.thumbnail}
        title={<SearchHighlightText text={feed.title} keyword={keyword} />}
        nickname={feed.author?.name ?? ""}
        likeCount={feed.likeCount}
        viewCount={feed.viewCount}
        isLiked={isLiked}
        onLikeClick={isLoggedIn ? () => onLikeClick(feed.id, isLiked) : undefined}
      />
    </Link>
  );
}

export default function SearchFeed() {
  const router = useRouter();
  const keyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
  const sort = resolveSortOption("feed", router.query.sort);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedSearch({
    keyword,
    sort,
    size: 10,
  });

  useGlobalLoading(isLoading);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  const hasResults = data?.pages.some((page) => page.feeds.length > 0) ?? false;

  const handleLikeClick = (id: string, isLiked: boolean) => {
    toggleLike({ id, isLiked });
  };

  if (isLoading) return null;

  return (
    <section className={styles.results}>
      {!hasResults ? (
        <Empty
          iconName="illust-result-null"
          size={isMobile ? "md" : "xl"}
          title="검색한 결과를 찾을 수 없어요"
          content="검색어의 단어 수를 줄이거나 다른 검색어로 검색해보세요."
        />
      ) : (
        <div className={styles.grid}>
          {data?.pages.map((page) =>
            page.feeds.map((feed) => (
              <SearchFeedItem
                key={feed.id}
                feed={feed}
                keyword={keyword}
                isLoggedIn={isLoggedIn}
                onLikeClick={handleLikeClick}
              />
            )),
          )}
        </div>
      )}

      {hasNextPage && <div ref={loadMoreRef} className={styles.loader} />}
    </section>
  );
}
