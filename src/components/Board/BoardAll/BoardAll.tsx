import { useRouter } from "next/router";
import styles from "./BoardAll.module.scss";
import Title from "@/components/Layout/Title/Title";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import AllCard from "./AllCard/AllCard";
import { useEffect, useState } from "react";
import { getPostsLatest, getPostsNotices, PostsLatest } from "@/api/posts/getPosts";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { BoardAllProps } from "./BoardAll.types";
import { useToast } from "@/hooks/useToast";
import Dropdown from "@/components/Dropdown/Dropdown";
import { getPostSearch } from "@/api/posts/getPostsSearch";

type SortOption = "combined" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "combined", label: "제목+내용" },
  { value: "name", label: "글쓴이" },
];

export default function BoardAll({ isDetail }: BoardAllProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const [searchBy, setSearchBy] = useState<SortOption>("combined");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [posts, setPosts] = useState<PostsLatest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const { query } = router;
  const currentType = (query.type as string) || "ALL";
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalCount / 10);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query.keyword) return;
      try {
        const searchResponse = await getPostSearch({
          searchBy: (query.searchBy as "combined" | "name") || "combined",
          page: currentPage,
          keyword: query.keyword as string,
        });

        setPosts(searchResponse.posts);
        setTotalCount(Number(searchResponse.totalCount) || 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }

    fetchSearchResults();
  }, [query.keyword, query.searchBy, currentPage]);

  useEffect(() => {
    async function fetchPosts() {
      if (query.keyword) return;

      try {
        const noticesResponse = await getPostsNotices();
        const notices = noticesResponse;

        const latestResponse = await getPostsLatest({
          type: currentType as "ALL" | "QUESTION" | "FEEDBACK",
          page: currentPage,
          size: 10,
        });
        const latestPosts = latestResponse.posts;

        const mergedPosts = currentPage === 1 ? [...notices, ...latestPosts] : latestPosts;

        setPosts(mergedPosts);
        setTotalCount(latestResponse.totalCount + (currentPage === 1 ? notices.length : 0));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [currentType, currentPage, query.keyword]);

  const handleTabChange = (type: "ALL" | "QUESTION" | "FEEDBACK") => {
    const newQuery: { type: string; page: number; searchBy?: string; keyword?: string } = {
      ...query,
      type: type.toLowerCase(),
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

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length < 2) {
      showToast("두 글자 이상 입력해주세요.", "warning");
      return;
    }

    router.push(
      {
        pathname: "/board",
        query: {
          ...query,
          searchBy,
          keyword: trimmedKeyword,
          page: 1,
        },
      },
      undefined,
      { shallow: true }
    );

    setKeyword("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div className={styles.container}>
      {isDetail ? <Title>자유게시판 최신글</Title> : <Title>전체 글</Title>}
      {!isDetail && (
        <div className={styles.header}>
          <section className={styles.types}>
            <button
              className={`${styles.type} ${currentType === "all" ? styles.active : ""}`}
              onClick={() => handleTabChange("ALL")}
            >
              전체
            </button>
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
            <button
              className={`${styles.type} ${currentType === "question" ? styles.active : ""}`}
              onClick={() => handleTabChange("QUESTION")}
            >
              질문
            </button>
            <Image src="/icon/dot.svg" width={3} height={3} alt="" />
            <button
              className={`${styles.type} ${currentType === "feedback" ? styles.active : ""}`}
              onClick={() => handleTabChange("FEEDBACK")}
            >
              피드백
            </button>
          </section>
          {currentType === "all" && (
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
                        <IconComponent name="arrowUp" width={20} height={20} isBtn />
                      ) : (
                        <IconComponent name="arrowDown" width={20} height={20} isBtn />
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
                  <IconComponent
                    name="searchGray"
                    width={24}
                    height={24}
                    padding={8}
                    isBtn
                    alt="검색"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <section className={styles.cards}>
        {posts.map((post) => (
          <AllCard key={post.id} post={post} case="board" />
        ))}
      </section>
      {posts.length === 0 && <div className={styles.noResults}>검색 결과가 없습니다</div>}
      {isLoggedIn && !isDetail && (
        <section className={styles.uploadBtn}>
          <Link href="/board/write">
            <Button
              size="l"
              type="outlined-assistive"
              leftIcon={<IconComponent name="writePost" width={20} height={20} />}
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
          <Image src="/icon/pagination-left.svg" width={24} height={24} alt="" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? styles.active : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={styles.paginationArrow}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || posts.length === 0}
        >
          <Image src="/icon/pagination-right.svg" width={24} height={24} alt="" />
        </button>
      </section>
    </div>
  );
}
