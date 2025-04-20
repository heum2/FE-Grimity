import { useRouter } from "next/router";
import styles from "./SearchPost.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import { usePostSearch } from "@/api/posts/getPostsSearch";
import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import { useState } from "react";

type SortOption = "accuracy";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "accuracy", label: "정확도순" },
];

export default function SearchPost() {
  const router = useRouter();
  const { query } = router;
  const keyword = query.keyword as string;
  const currentPage = Number(query.page) || 1;
  const [sortBy, setSortBy] = useState<SortOption>("accuracy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data, isLoading } = usePostSearch({
    searchBy: "combined",
    page: currentPage,
    size: 10,
    keyword: keyword,
  });

  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount ? Number(data.totalCount) : 0) / 10);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
  };

  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(start + 9, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className={styles.results}>
        {data && data.totalCount === 0 ? (
          <div className={styles.noResult}>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div>
            <div className={styles.sortWrapper}>
              <h2 className={styles.title}>
                검색결과 <span className={styles.searchCount}>{data ? data.totalCount : 0}</span>건
              </h2>
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
                          <IconComponent name="arrowUp" size={20} isBtn />
                        ) : (
                          <IconComponent name="arrowDown" size={20} isBtn />
                        )
                      }
                    >
                      {sortOptions.find((option) => option.value === sortBy)?.label || "정확도순"}
                    </Button>
                  }
                />
              </div>
            </div>
            <div className={styles.cards}>
              {posts.map((post) => (
                <AllCard key={post.id} post={post} case="board" />
              ))}
            </div>
          </div>
        )}
      </section>
      {totalPages > 1 && posts.length > 0 && (
        <section className={styles.pagination}>
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IconComponent name="paginationLeft" size={24} />
          </button>
          {getPageRange(currentPage, totalPages).map((pageNum) => (
            <button
              key={pageNum}
              className={currentPage === pageNum ? styles.active : ""}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || posts.length === 0}
          >
            <IconComponent name="paginationRight" size={24} />
          </button>
        </section>
      )}
    </>
  );
}
