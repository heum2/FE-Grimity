import Link from "next/link";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";

import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";
import Title from "@/components/Layout/Title/Title";
import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Loader from "@/components/Layout/Loader/Loader";
import SearchSection from "@/components/Board/BoardAll/SearchSection";
import TabNavigation from "@/components/Board/BoardAll/TabNavigation";
import Pagination from "@/components/Pagination";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useBoardAll } from "@/components/Board/BoardAll/hooks/useBoardAll";

import { PATH_ROUTES } from "@/constants/routes";

import type { BoardAllProps } from "@/components/Board/BoardAll/BoardAll.types";

import styles from "@/components/Board/BoardAll/BoardAll.module.scss";

export default function BoardAll({ isDetail, hasChip }: BoardAllProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();

  const {
    searchBy,
    posts,
    keyword,
    setKeyword,
    currentType,
    currentPage,
    totalPages,
    isLoading,
    handleTabChange,
    handlePageChange,
    handleSearch,
    handleSearchKeyDown,
    handleSortChange,
  } = useBoardAll({ isDetail });

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {isMobile && currentType === "all" && !isDetail && (
        <SearchSection
          searchBy={searchBy}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          onSearchKeyDown={handleSearchKeyDown}
          onSortChange={handleSortChange}
        />
      )}

      {isDetail ? <Title>자유게시판 최신글</Title> : <Title>전체 글</Title>}

      {!isDetail && (
        <div className={styles.header}>
          <TabNavigation currentType={currentType} onTabChange={handleTabChange} />
          {!isMobile && currentType === "all" && (
            <SearchSection
              searchBy={searchBy}
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onSearchKeyDown={handleSearchKeyDown}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      )}

      <section className={styles.cards}>
        {posts.map((post) => (
          <AllCard key={post.id} post={post} case="board" hasChip={hasChip} />
        ))}
      </section>

      {posts.length === 0 && <div className={styles.noResults}>검색 결과가 없어요</div>}

      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          postsLength={posts.length}
          onPageChange={handlePageChange}
        />

        {!isMobile && isLoggedIn && !isDetail && (
          <Link href={PATH_ROUTES.BOARD_WRITE} className={styles.uploadBtn}>
            <Button type="outlined-assistive" leftIcon={<Icon icon="detailWrite" />}>
              글쓰기
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
