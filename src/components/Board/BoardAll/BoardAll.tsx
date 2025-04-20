import { useRouter } from "next/router";
import styles from "./BoardAll.module.scss";
import Title from "@/components/Layout/Title/Title";
import Link from "next/link";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import AllCard from "./AllCard/AllCard";
import { useEffect, useState } from "react";
import { PostResponse, usePostsLatest, usePostsNotices } from "@/api/posts/getPosts";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { BoardAllProps } from "./BoardAll.types";
import { useToast } from "@/hooks/useToast";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useIsMobile } from "@/hooks/useIsMobile";
import Loader from "@/components/Layout/Loader/Loader";
import { usePostSearch } from "@/api/posts/getPostsSearch";

type SortOption = "combined" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "combined", label: "제목+내용" },
  { value: "name", label: "글쓴이" },
];

export default function BoardAll({ isDetail, hasChip }: BoardAllProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchBy, setSearchBy] = useState<SortOption>("combined");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const { query } = router;
  const currentType = (query.type as string) || "all";
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalCount / 5);
  const { showToast } = useToast();
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();
  const { pathname } = useRouter();

  const { data: noticesData } = usePostsNotices();
  const {
    data: latestData,
    isLoading,
    refetch,
  } = usePostsLatest({
    type: currentType.toUpperCase() as "ALL" | "QUESTION" | "FEEDBACK",
    page: currentPage,
    size: 5,
  });

  const { data: searchData, isLoading: isSearchLoading } = usePostSearch(
    query.keyword
      ? {
          searchBy: (query.searchBy as "combined" | "name") || "combined",
          size: 5,
          page: currentPage,
          keyword: query.keyword as string,
        }
      : null,
  );

  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    if (!router.isReady) return;

    if (query.keyword) {
      if (searchData) {
        setPosts(searchData.posts);
        setTotalCount(searchData.totalCount);
      }
    } else if (noticesData && latestData) {
      const mergedPosts =
        currentPage === 1 ? [...noticesData, ...latestData.posts] : latestData.posts;

      setPosts(mergedPosts);
      setTotalCount(latestData.totalCount + (currentPage === 1 ? noticesData.length : 0));
    }
  }, [
    currentType,
    currentPage,
    query.keyword,
    router.isReady,
    noticesData,
    latestData,
    searchData,
  ]);

  const handleTabChange = (type: "all" | "question" | "feedback") => {
    const newQuery: { type: string; page: number; searchBy?: string; keyword?: string } = {
      ...query,
      type: type,
      page: 1,
    };

    delete newQuery.searchBy;
    delete newQuery.keyword;

    router.push({ query: newQuery });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
  };

  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage);
    let end = Math.min(start + 4, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length < 2) {
      if (!trimmedKeyword) {
        router.push(
          {
            pathname: "/board",
            query: {
              ...query,
              type: currentType,
              page: 1,
            },
          },
          undefined,
          { shallow: true },
        );
      } else {
        showToast("두 글자 이상 입력해주세요.", "warning");
      }
      return;
    }

    router.push(
      {
        pathname: "/board",
        query: {
          ...query,
          type: currentType,
          searchBy,
          keyword: trimmedKeyword,
          page: 1,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSortChange = (option: SortOption) => {
    setSearchBy(option);
    router.push({
      pathname: "/board",
      query: { ...query, searchBy: option, page: 1 },
    });
  };

  if (isLoading || isSearchLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {isMobile && currentType === "all" && (
        <div className={styles.search}>
          <div className={styles.dropdown}>
            <Dropdown
              menuItems={sortOptions.map((option) => ({
                label: option.label,
                value: option.value,
                onClick: () => handleSortChange(option.value),
              }))}
              onOpenChange={handleDropdownToggle}
              trigger={
                <button className={styles.dropdownBtn}>
                  {sortOptions.find((option) => option.value === searchBy)?.label || "제목+내용"}
                  {isDropdownOpen ? (
                    <IconComponent name="arrowUp" size={20} isBtn />
                  ) : (
                    <IconComponent name="arrowDown" size={20} isBtn />
                  )}
                </button>
              }
            />
          </div>
          <div className={styles.searchbarContainer}>
            <input
              placeholder="검색어를 입력해주세요"
              className={styles.input}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <div onClick={handleSearch}>
              <IconComponent name="searchGray" size={24} padding={8} isBtn />
            </div>
          </div>
        </div>
      )}
      {isDetail ? <Title>자유게시판 최신글</Title> : <Title>전체 글</Title>}
      {!isDetail && (
        <div className={styles.header}>
          <section className={styles.types}>
            <button
              className={`${styles.type} ${currentType === "all" ? styles.active : ""}`}
              onClick={() => handleTabChange("all")}
            >
              전체
            </button>
            <IconComponent name="dot" size={3} />
            <button
              className={`${styles.type} ${currentType === "question" ? styles.active : ""}`}
              onClick={() => handleTabChange("question")}
            >
              질문
            </button>
            <IconComponent name="dot" size={3} />
            <button
              className={`${styles.type} ${currentType === "feedback" ? styles.active : ""}`}
              onClick={() => handleTabChange("feedback")}
            >
              피드백
            </button>
          </section>
          {!isMobile && currentType === "all" && (
            <div className={styles.search}>
              <div className={styles.dropdown}>
                <Dropdown
                  menuItems={sortOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                    onClick: () => handleSortChange(option.value),
                  }))}
                  onOpenChange={handleDropdownToggle}
                  trigger={
                    <button className={styles.dropdownBtn}>
                      {sortOptions.find((option) => option.value === searchBy)?.label ||
                        "제목+내용"}
                      {isDropdownOpen ? (
                        <IconComponent name="arrowUp" size={20} isBtn />
                      ) : (
                        <IconComponent name="arrowDown" size={20} isBtn />
                      )}
                    </button>
                  }
                />
              </div>
              <div className={styles.searchbarContainer}>
                <input
                  placeholder="검색어를 입력해주세요"
                  className={styles.input}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <div onClick={handleSearch}>
                  <IconComponent name="searchGray" size={20} padding={8} isBtn />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <section className={styles.cards}>
        {posts.map((post) => (
          <AllCard key={post.id} post={post} case="board" hasChip={hasChip} />
        ))}
      </section>
      {posts.length === 0 && <div className={styles.noResults}>검색 결과가 없어요</div>}
      {!isMobile && isLoggedIn && !isDetail && (
        <section className={styles.uploadBtn}>
          <Link href="/board/write">
            <Button
              size="l"
              type="outlined-assistive"
              leftIcon={<IconComponent name="writePost" size={20} />}
            >
              글쓰기
            </Button>
          </Link>
        </section>
      )}
      <section className={`${styles.pagination} ${isDetail ? styles.paginationDetail : ""}`}>
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
    </div>
  );
}
