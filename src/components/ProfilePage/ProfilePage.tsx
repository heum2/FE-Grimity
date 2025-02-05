import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useUserData } from "@/api/users/getId";
import { getUserFeeds } from "@/api/users/getIdFeeds";
import Profile from "./Profile/Profile";
import styles from "./ProfilePage.module.scss";
import { ProfilePageProps } from "./ProfilePage.types";
import ProfileCard from "../Layout/ProfileCard/ProfileCard";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import IconComponent from "../Asset/Icon";
import { all } from "axios";
import Link from "next/link";

type SortOption = "latest" | "like" | "oldest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신 순" },
  { value: "like", label: "좋아요 순" },
  { value: "oldest", label: "오래된 순" },
];

const PAGE_SIZE = 12;

export default function ProfilePage({ isMyProfile, id }: ProfilePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [activeTab, setActiveTab] = useState<"images" | "texts">("images");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const imagesTabRef = useRef<HTMLDivElement>(null);
  const textsTabRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useUserData(id);
  const { ref, inView } = useInView();
  const [feeds, setFeeds] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const {
    data: feedsData,
    fetchNextPage,
    hasNextPage,
    refetch,
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
    queryClient.resetQueries(["userFeeds", id, sortBy]);
    setFeeds([]);
    refetch();
  }, [sortBy, id, queryClient, refetch]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
    const activeTabRef = activeTab === "images" ? imagesTabRef : textsTabRef;
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
            ref={imagesTabRef}
            className={`${styles.tab} ${activeTab === "images" ? styles.active : ""}`}
            onClick={() => setActiveTab("images")}
          >
            그림<p className={styles.feedCount}>{userData?.feedCount}</p>
          </div>
          <div
            ref={textsTabRef}
            className={`${styles.tab} ${activeTab === "texts" ? styles.active : ""}`}
            onClick={() => setActiveTab("texts")}
          >
            글<p className={styles.feedCount}>0</p>
          </div>
          <div
            className={styles.indicator}
            style={{
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
            }}
          />
        </div>
        <div className={styles.feedContainer}>
          {allFeeds.length !== 0 && (
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
                      {sortOptions.find((option) => option.value === sortBy)?.label || "최신 순"}
                    </Button>
                  }
                />
              </div>
            </section>
          )}
          {activeTab === "images" ? (
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
            <p>준비 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}
