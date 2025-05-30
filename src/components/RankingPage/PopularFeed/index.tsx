import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";

import DatePicker from "@/components/DatePicker";
import TabView from "@/components/TabView";
import Loader from "@/components/Layout/Loader/Loader";
import Title from "@/components/Layout/Title/Title";
import FeedCard from "@/components/RankingPage/PopularFeed";

import { usePopularFeed } from "@/api/feeds/getPopular";

import { DatePickerMode } from "@/components/DatePicker/DatePicker.types";

import styles from "@/components/RankingPage/PopularFeed/PopularFeed.module.scss";

export default function PopularFeed() {
  const { pathname, query } = useRouter();

  const mode = (query.mode as DatePickerMode) || DatePickerMode.WEEK;
  const date = (query.date as string) ? new Date(query.date as string) : new Date();

  const [activeTab, setActiveTab] = useState<DatePickerMode>(mode);
  const [selectedDate, setSelectedDate] = useState<Date>(date);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    usePopularFeed();

  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
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

  if (isLoading) <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Title>인기 그림 순위</Title>
      </div>

      <TabView
        tabs={[
          { label: "주간", key: DatePickerMode.WEEK },
          { label: "월간", key: DatePickerMode.MONTH },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className={styles.datePickerContainer}>
        <DatePicker mode={activeTab} selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <section className={styles.feedContainer}>
        {data?.pages.map((page) => page.feeds.map((feed) => <FeedCard key={feed.id} {...feed} />))}
      </section>
      {hasNextPage && <div ref={loadMoreRef} />}
    </div>
  );
}
