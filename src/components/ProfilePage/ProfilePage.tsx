import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { useUserData } from "@/api/users/getId";
import { getUserFeeds } from "@/api/users/getIdFeeds";
import Profile from "./Profile/Profile";
import styles from "./ProfilePage.module.scss";
import { ProfilePageProps } from "./ProfilePage.types";
import ProfileCard from "../Layout/ProfileCard/ProfileCard";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import IconComponent from "../Asset/Icon";
import Link from "next/link";
import { getUserPosts } from "@/api/users/getIdPosts";
import { useRouter } from "next/router";
import AllCard from "../Board/BoardAll/AllCard/AllCard";
import Image from "next/image";

type SortOption = "latest" | "like" | "oldest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "like", label: "좋아요순" },
  { value: "oldest", label: "오래된순" },
];

const PAGE_SIZE = 12;

export default function ProfilePage({ isMyProfile, id }: ProfilePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const feedsTabRef = useRef<HTMLDivElement>(null);
  const postsTabRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useUserData(id);
  const { ref, inView } = useInView();
  const [feeds, setFeeds] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { query } = router;
  const currentPage = Number(query.page) || 1;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / 10);
  const [activeTab, setActiveTab] = useState<"feeds" | "posts">(
    (query.tab as "feeds" | "posts") || "feeds"
  );

  useEffect(() => {
    setFeeds([]);
    setActiveTab("feeds");
  }, [id]);

  useEffect(() => {
    if (query.tab && (query.tab === "feeds" || query.tab === "posts")) {
      setActiveTab(query.tab);
    }
  }, [query.tab]);

  const handleTabChange = (tab: "feeds" | "posts") => {
    setActiveTab(tab);
    const { page, ...restQuery } = query;
    router.push(
      {
        query: { ...restQuery, tab },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const {
    data: feedsData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["userFeeds", id, sortBy],
    async ({ pageParam = null }) => {
      const data = await getUserFeeds({
        id,
        size: PAGE_SIZE,
        sort: sortBy,
        cursor: pageParam,
      });
      return {
        items: data.feeds,
        nextCursor: data.nextCursor,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getUserPosts({ id, size: 10, page: currentPage });

        setPosts(data);
        setTotalCount(userData?.postCount ?? 0);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    if (isMyProfile) {
      fetchPosts();
    }
  }, [currentPage]);

  useEffect(() => {
    if (feedsData?.pages) {
      const newFeeds = feedsData.pages.flatMap((page) => page.items);
      setFeeds((prevFeeds) => {
        const uniqueFeeds = new Map();
        [...prevFeeds, ...newFeeds].forEach((feed) => {
          uniqueFeeds.set(feed.id, feed);
        });
        return Array.from(uniqueFeeds.values());
      });
    }
  }, [feedsData]);

  useEffect(() => {
    const activeTabRef = activeTab === "feeds" ? feedsTabRef : postsTabRef;
    if (!activeTabRef.current) return;

    const { offsetWidth, offsetLeft } = activeTabRef.current;
    setIndicatorStyle({ width: offsetWidth, left: offsetLeft });

    const observer = new MutationObserver(() => {
      if (activeTabRef.current) {
        const { offsetWidth, offsetLeft } = activeTabRef.current;
        setIndicatorStyle({ width: offsetWidth, left: offsetLeft });
      }
    });

    observer.observe(activeTabRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [activeTab]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } }, undefined, { shallow: true });
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  const allFeeds = feeds;

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Profile isMyProfile={isMyProfile} id={id} />
        <div className={styles.bar}>
          <div
            ref={feedsTabRef}
            className={`${styles.tab} ${activeTab === "feeds" ? styles.active : ""}`}
            onClick={() => handleTabChange("feeds")}
          >
            그림<p className={styles.feedCount}>{userData?.feedCount}</p>
          </div>
          {isMyProfile && (
            <div
              ref={postsTabRef}
              className={`${styles.tab} ${activeTab === "posts" ? styles.active : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              글<p className={styles.feedCount}>{userData?.postCount}</p>
            </div>
          )}
          <div
            className={styles.indicator}
            style={{
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
            }}
          />
        </div>
        <div className={styles.feedContainer}>
          {allFeeds.length !== 0 && activeTab === "feeds" && (
            <section className={styles.header}>
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
                      {sortOptions.find((option) => option.value === sortBy)?.label || "최신순"}
                    </Button>
                  }
                />
              </div>
            </section>
          )}
          {activeTab === "feeds" ? (
            allFeeds.length === 0 ? (
              isMyProfile ? (
                <div className={styles.empty}>
                  <p className={styles.message}>첫 그림을 업로드해보세요</p>
                  <Link href="/write">
                    <Button size="m" type="filled-primary">
                      그림 업로드
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className={styles.empty}>
                  <p className={styles.message}>아직 업로드한 그림이 없어요</p>
                </div>
              )
            ) : (
              <section className={styles.cardContainer}>
                {allFeeds.map((feed, index) => (
                  <div key={`${feed.id}-${index}`}>
                    <ProfileCard
                      title={feed.title}
                      cards={feed.cards}
                      thumbnail={feed.thumbnail}
                      likeCount={feed.likeCount}
                      commentCount={feed.commentCount}
                      createdAt={feed.createdAt}
                      id={feed.id}
                    />
                  </div>
                ))}
                <div ref={ref} />
              </section>
            )
          ) : (
            <section>
              {posts.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.message}>첫 글을 업로드해보세요</p>
                  <Link href="/board">
                    <Button size="m" type="filled-primary">
                      자유게시판 바로가기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className={styles.postContainer}>
                  {posts.map((post) => (
                    <AllCard key={post.id} post={post} case="my-posts" />
                  ))}
                </div>
              )}
              <section className={styles.pagination}>
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
