import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./SearchAuthor.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import SearchProfile from "../SearchProfile/SearchProfile";
import { useUserSearch } from "@/api/users/getUsersSearch";

type SortOption = "popular";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "인기 순" },
];

export default function SearchAuthor() {
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    sort: sortBy,
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
              {sortOptions.find((option) => option.value === sortBy)?.label || "인기 순"}
            </Button>
          }
        />
      </div>
      {data?.pages.length === 0 || !data?.pages.some((page) => page.users.length > 0) ? (
        <p className={styles.noResult}>검색 결과가 없어요</p>
      ) : (
        <div className={styles.feedContainer}>
          {data.pages.map((page) =>
            page.users.map((user) => <SearchProfile key={user.id} {...user} />)
          )}
        </div>
      )}
      <div ref={loadMoreRef} />
    </section>
  );
}
