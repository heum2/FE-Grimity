import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./SearchAuthor.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import SearchProfile from "../SearchProfile/SearchProfile";
import { useUserSearch } from "@/api/users/getUsersSearch";

export default function SearchAuthor() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const keyword = router.query.keyword as string | undefined;
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [router.query]);

  const { data, isLoading, fetchNextPage, hasNextPage } = useUserSearch({
    keyword: searchKeyword,
    size: 10,
  });

  const loadMoreRef = useRef(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    };

    observer.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });

    observer.current.observe(element);

    return () => {
      if (observer.current && element) {
        observer.current.unobserve(element);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <Loader />;

  return (
    <section className={styles.results}>
      <h2 className={styles.title}>
        검색결과&nbsp;
        <span className={styles.searchCount}>{data?.pages?.[0]?.totalCount || 0}</span>건
      </h2>
      {data?.pages.length === 0 || !data?.pages.some((page) => page.users.length > 0) ? (
        <p className={styles.noResult}>검색 결과가 없어요</p>
      ) : (
        <div className={styles.feedContainer}>
          {data.pages.map((page) =>
            page.users.map((user) => <SearchProfile key={user.id} {...user} />),
          )}
        </div>
      )}
      <div ref={loadMoreRef} />
    </section>
  );
}
