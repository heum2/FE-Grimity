import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./SearchFeed.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import SearchCard from "../SearchCard/SearchCard";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import { useFeedSearch } from "@/api/feeds/getFeedsSearch";

type SortOption = "latest" | "popular" | "accuracy";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "accuracy", label: "정확도순" },
];

export default function SearchFeed() {
  const [sortBy, setSortBy] = useState<SortOption>("accuracy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const keyword = router.query.keyword as string | undefined;
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [router.query]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedSearch({
    keyword: searchKeyword,
    sort: sortBy,
    size: 10,
  });

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      }
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

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  if (isLoading) return <Loader />;

  return (
    <section className={styles.results}>
      <div className={styles.sortWrapper}>
        <h2 className={styles.title}>그림 {data?.pages?.[0]?.totalCount || 0}개</h2>
        <div className={styles.sort}>
          <Dropdown
            menuItems={sortOptions.map((option) => ({
              label: option.label,
              value: option.value,
              onClick: () => handleSortChange(option.value),
            }))}
            onOpenChange={handleDropdownToggle}
            trigger={
              <Button
                type="text-assistive"
                size="l"
                rightIcon={
                  isDropdownOpen ? (
                    <IconComponent name="arrowUp" width={20} height={20} isBtn />
                  ) : (
                    <IconComponent name="arrowDown" width={20} height={20} isBtn />
                  )
                }
              >
                {sortOptions.find((option) => option.value === sortBy)?.label || "정확도순"}
              </Button>
            }
          />
        </div>
      </div>
      {data?.pages.length === 0 || !data?.pages.some((page) => page.feeds.length > 0) ? (
        <p className={styles.noResult}>검색 결과가 없어요</p>
      ) : (
        <div className={styles.feedContainer}>
          {data.pages.map((page) =>
            page.feeds.map((feed) => <SearchCard key={feed.id} {...feed} />)
          )}
        </div>
      )}
      {hasNextPage && <div ref={loadMoreRef} />}
    </section>
  );
}
