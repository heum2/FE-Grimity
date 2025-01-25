import { useEffect, useState } from "react";
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

type SortOption = "latest" | "like" | "oldest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신 순" },
  { value: "like", label: "좋아요 순" },
  { value: "oldest", label: "오래된 순" },
];

const PAGE_SIZE = 12;

export default function ProfilePage({ isMyProfile, id }: ProfilePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const { data: userData } = useUserData(id);
  const { ref, inView } = useInView();
  const [feeds, setFeeds] = useState<any[]>([]);
  const queryClient = useQueryClient();

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
      setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
    }
  }, [feedsData]);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  const allFeeds = feeds;

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Profile isMyProfile={isMyProfile} id={id} />
        <div className={styles.bar} />
        <div className={styles.feedContainer}>
          <section className={styles.header}>
            <div className={styles.title}>
              그림
              <p className={styles.feedCount}>{userData?.feedCount}</p>
            </div>
            <div className={styles.sortWrapper}>
              <Dropdown
                menuItems={sortOptions.map((option) => ({
                  label: option.label,
                  value: option.value,
                  onClick: () => handleSortChange(option.value),
                }))}
                trigger={
                  <Button type="text-assistive" size="l" rightIcon="/icon/arrow-down.svg">
                    {sortOptions.find((option) => option.value === sortBy)?.label || "최신 순"}
                  </Button>
                }
              />
            </div>
          </section>
          <section className={styles.cardContainer}>
            {allFeeds.map((feed, index) => (
              <div key={`${feed.id}-${index}`}>
                <ProfileCard
                  title={feed.title}
                  cards={feed.cards}
                  likeCount={feed.likeCount}
                  commentCount={feed.commentCount}
                  createdAt={feed.createdAt}
                  id={feed.id}
                />
              </div>
            ))}
            <div ref={ref} />
          </section>
        </div>
      </div>
    </div>
  );
}
