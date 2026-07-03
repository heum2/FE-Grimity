import { useEffect, useState } from "react";

import { getSubscribe, putSubscribe, SubscriptionType } from "@/api/users/subscribe";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import ControlItem from "@/components/common/Cell/ControlItem/ControlItem";

import styles from "./NotificationSettings.module.scss";

const ALL_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
];

export default function NotificationSettings() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  useEffect(() => {
    getSubscribe()
      .then((res) => setSubscriptions(res.subscription))
      .catch((error) => console.error("Failed to fetch subscriptions:", error));
  }, []);

  const has = (type: SubscriptionType) => subscriptions.includes(type);
  const isAllOn = subscriptions.length === ALL_SUBSCRIPTION_TYPES.length;

  const toggleSubscription = async (type: SubscriptionType) => {
    const isSubscribed = has(type);
    try {
      await putSubscribe({ type: isSubscribed ? "ALL" : type });
      setSubscriptions((prev) =>
        isSubscribed ? prev.filter((sub) => sub !== type) : [...prev, type],
      );
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
    }
  };

  const toggleAll = async () => {
    const wasAllOn = isAllOn;
    try {
      await putSubscribe({ type: "ALL" });
      setSubscriptions(wasAllOn ? [] : [...ALL_SUBSCRIPTION_TYPES]);
    } catch (error) {
      console.error("Failed to toggle all subscriptions:", error);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toggleContainer}>
        <ControlItem type="toggle" text="모든 알림" active={isAllOn} onClick={toggleAll} />
        <ControlItem
          type="toggle"
          text="팔로우 알림"
          active={has("FOLLOW")}
          onClick={() => toggleSubscription("FOLLOW")}
        />
      </div>

      <ListItem type="section" text="그림" />
      <div className={styles.toggleContainer}>
        <ControlItem
          type="toggle"
          text="좋아요 알림"
          active={has("FEED_LIKE")}
          onClick={() => toggleSubscription("FEED_LIKE")}
        />
        <ControlItem
          type="toggle"
          text="새 댓글 알림"
          active={has("FEED_COMMENT")}
          onClick={() => toggleSubscription("FEED_COMMENT")}
        />
        <ControlItem
          type="toggle"
          text="새 답글 알림"
          active={has("FEED_REPLY")}
          onClick={() => toggleSubscription("FEED_REPLY")}
        />
      </div>

      <ListItem type="section" text="자유게시판" />
      <div className={styles.toggleContainer}>
        <ControlItem
          type="toggle"
          text="새 댓글 알림"
          active={has("POST_COMMENT")}
          onClick={() => toggleSubscription("POST_COMMENT")}
        />
        <ControlItem
          type="toggle"
          text="새 답글 알림"
          active={has("POST_REPLY")}
          onClick={() => toggleSubscription("POST_REPLY")}
        />
      </div>
    </div>
  );
}
