import { useRouter } from "next/router";

import { useMyLikeList } from "@/api/users/getMeLikeFeeds";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";

import { PATH_ROUTES } from "@/constants/routes";

import styles from "./LikedFeeds.module.scss";

export default function LikedFeeds() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyLikeList({
    size: 20,
  });

  useGlobalLoading(isLoading);

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isLoading) return null;

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  if (feeds.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Empty
          iconName="illust-result-null"
          title="좋아요한 그림이 없어요"
          buttonLabel="인기 그림 둘러보기"
          onButtonClick={() => router.push(PATH_ROUTES.RANKING)}
        />
      </div>
    );
  }

  return (
    <>
      <section className={styles.grid}>
        {feeds.map((feed) => (
          <Album
            key={feed.id}
            variant="mainTitle"
            linkHref={`${PATH_ROUTES.FEEDS}/${feed.id}`}
            imageUrl={feed.thumbnail}
            title={feed.title}
            nickname={feed.author?.name ?? ""}
            likeCount={feed.likeCount}
            viewCount={feed.viewCount}
            isLiked
            onLikeClick={
              isLoggedIn ? () => toggleLike({ id: feed.id, isLiked: true }) : undefined
            }
          />
        ))}
      </section>
      <div ref={loadMoreRef} />
    </>
  );
}
