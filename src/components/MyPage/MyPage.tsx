import { useRouter } from "next/router";
import LikedFeeds from "./LikedFeeds/LikedFeeds";
import SavedFeeds from "./SavedFeeds/SavedFeeds";
import SavedPosts from "./SavedPosts/SavedPosts";

import UnderlineTabs from "@/components/UnderlineTabs/UnderlineTabs";

import styles from "./MyPage.module.scss";

type TabKey = "liked-feeds" | "saved-feeds" | "saved-posts";

const TABS: { key: TabKey; label: string; hasSeparatorAfter?: boolean }[] = [
  { key: "liked-feeds", label: "좋아요한 그림" },
  { key: "saved-feeds", label: "저장한 그림", hasSeparatorAfter: true },
  { key: "saved-posts", label: "저장한 글" },
];

export default function MyPage() {
  const router = useRouter();
  const { tab } = router.query;

  const handleTabChange = (tabKey: TabKey) => {
    router.push(`?tab=${tabKey}`);
  };

  const getTabComponent = () => {
    switch (tab) {
      case "liked-feeds":
        return <LikedFeeds />;
      case "saved-feeds":
        return <SavedFeeds />;
      case "saved-posts":
        return <SavedPosts />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.navContainer}>
        <UnderlineTabs tabs={TABS} activeTab={tab as TabKey} onTabChange={handleTabChange} />
      </section>

      <div className={styles.wrapper}>
        <div className={styles.center}>{getTabComponent()}</div>
      </div>
    </div>
  );
}
