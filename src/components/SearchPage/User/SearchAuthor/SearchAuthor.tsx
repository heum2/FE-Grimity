import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useUserSearch } from "@/api/users/getUsersSearch";
import { useDeviceStore } from "@/states/deviceStore";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import Empty from "@/components/common/Empty/Empty";

import SearchProfile from "../SearchProfile/SearchProfile";

import styles from "./SearchAuthor.module.scss";

export default function SearchAuthor() {
  const router = useRouter();
  const keyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
  const isMobile = useDeviceStore((state) => state.isMobile);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserSearch({
    keyword,
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
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  const hasResults = data?.pages.some((page) => page.users.length > 0) ?? false;

  if (isLoading) return null;

  return (
    <section className={styles.results}>
      {!hasResults ? (
        <Empty
          iconName="illust-result-null"
          title="검색한 결과를 찾을 수 없어요"
          size={isMobile ? "md" : "xl"}
          content="검색어의 단어 수를 줄이거나 다른 검색어로 검색해보세요."
        />
      ) : (
        <div className={styles.grid}>
          {data?.pages.map((page) =>
            page.users.map((user) => <SearchProfile key={user.id} {...user} />),
          )}
        </div>
      )}

      {hasNextPage && <div ref={loadMoreRef} className={styles.loader} />}
    </section>
  );
}
