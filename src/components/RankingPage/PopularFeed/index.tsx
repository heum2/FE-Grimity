import { useRouter } from "next/router";

import { subWeeks } from "date-fns";

import DatePicker from "@/components/DatePicker";
import TabView from "@/components/TabView";
import Title from "@/components/Layout/Title/Title";
import FeedCard from "@/components/RankingPage/PopularFeed/FeedCard/FeedCard";

import { useRankings } from "@/api/feeds/getRankings";

import { DatePickerMode } from "@/components/DatePicker/DatePicker.types";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/RankingPage/PopularFeed/PopularFeed.module.scss";

export default function PopularFeed() {
  const router = useRouter();
  const { query } = router;

  const mode = (query.mode as DatePickerMode) || DatePickerMode.WEEK;
  const date = (query.date as string) ? new Date(query.date as string) : new Date();

  const { data } = useRankings({
    ...(mode === DatePickerMode.MONTH && { month: formattedDate(date, "yyyy-MM") }),
    startDate: formattedDate(subWeeks(date, 1), "yyyy-MM-dd"),
    endDate: formattedDate(date, "yyyy-MM-dd"),
  });

  const handleTabChange = (newMode: DatePickerMode) => {
    router.replace({
      pathname: router.pathname,
      query: {
        mode: newMode,
      },
    });
  };

  const handleDateChange = (newDate: Date) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...query,
        date: formattedDate(newDate, "yyyy-MM-dd"),
      },
    });
  };

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
        activeTab={mode}
        onTabChange={handleTabChange}
      />

      <div className={styles.datePickerContainer}>
        <DatePicker mode={mode} selectedDate={date} onDateChange={handleDateChange} />
      </div>

      <section className={styles.feedContainer}>
        {data?.feeds.map((feed) => (
          <FeedCard key={feed.id} {...feed} />
        ))}
      </section>
    </div>
  );
}
