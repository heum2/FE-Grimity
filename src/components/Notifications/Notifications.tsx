import { useEffect, useState } from "react";
import { useGetNotifications } from "@/api/notifications/getNotifications";
import IconComponent from "../Asset/Icon";
import Noti from "./Noti/Noti";
import Image from "next/image";
import styles from "./Notifications.module.scss";
import { NotificationsProps } from "./Notifications.types";
import { useRouter } from "next/router";
import { deleteNotifications } from "@/api/notifications/deleteNotifications";
import { putNotifications } from "@/api/notifications/putNotifications";
import { getSubscribe, putSubscribe, SubscriptionType } from "@/api/users/subscribe";

const ALL_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
];

export default function Notifications({ onClose }: NotificationsProps) {
  const { data = [], refetch } = useGetNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await getSubscribe();
        setSubscriptions(response.subscription);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    }
    fetchSubscriptions();
  }, []);

  const handleToggleSubscription = async (type: SubscriptionType, isSubscribed: boolean) => {
    try {
      const updatedType = isSubscribed ? "ALL" : type;
      await putSubscribe({ type: updatedType });
      if (isSubscribed) {
        setSubscriptions((prev) => prev.filter((sub) => sub !== type));
      } else {
        setSubscriptions((prev) => [...prev, type]);
      }
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
    }
  };

  const handleToggleAll = async (isSubscribed: boolean) => {
    try {
      const updatedType = isSubscribed ? "ALL" : "ALL";
      await putSubscribe({ type: updatedType });
      if (isSubscribed) {
        setSubscriptions([]);
      } else {
        setSubscriptions(ALL_SUBSCRIPTION_TYPES);
      }
    } catch (error) {
      console.error("Failed to toggle all subscriptions:", error);
    }
  };

  // 모두 읽음
  const handleMarkAllAsRead = async () => {
    try {
      await putNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // 전체 삭제
  const handleDeleteAllNotifications = async () => {
    try {
      await deleteNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };

  // 읽은 알림은 아래로, 안 읽은 알림은 최신 알림 순으로 정렬
  const sortedNotifications = data
    .sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isRead ? 1 : -1;
    })
    .slice(0, 50);

  return (
    <div className={styles.container}>
      {!isOpen ? (
        <div className={styles.notification}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>알림</h2>
              <div className={styles.headerBtns}>
                <button className={styles.settingButton} onClick={() => setIsOpen((prev) => !prev)}>
                  <IconComponent name="notiSetting" width={24} height={24} isBtn padding={8} />
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                  <IconComponent name="notiClose" width={24} height={24} isBtn padding={8} />
                </button>
              </div>
            </div>
          </section>
          <section className={styles.notiSection}>
            {data.length ? (
              sortedNotifications.map((notification) => (
                <Noti
                  key={notification.id}
                  notification={notification}
                  onClose={onClose}
                  onRefetch={refetch}
                />
              ))
            ) : (
              <div className={styles.noneNoti}>새로운 알림이 없어요</div>
            )}
          </section>
          {data.length !== 0 && (
            <div className={styles.options}>
              <button onClick={handleMarkAllAsRead} className={styles.option}>
                {<IconComponent name="notiRead" width={16} height={16} isBtn />}
                전체 읽음
              </button>
              <button onClick={handleDeleteAllNotifications} className={styles.option}>
                {<IconComponent name="notiDeleteAll" width={16} height={16} isBtn />}
                전체 삭제
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.setting}>
          <section className={styles.topSection}>
            <div className={styles.titleContainer}>
              <button className={styles.backButton} onClick={() => setIsOpen((prev) => !prev)}>
                <IconComponent name="notiBack" width={24} height={24} isBtn padding={8} />
              </button>
              <h2 className={styles.title}>알림 설정</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <IconComponent name="notiClose" width={24} height={24} isBtn padding={8} />
              </button>
            </div>
          </section>
          <section className={styles.notiOption}>
            <div className={styles.column}>
              <label className={styles.label}>모든 알림</label>
              <Image
                src={
                  subscriptions.length === 6
                    ? "/icon/noti-option-on.svg"
                    : "/icon/noti-option-off.svg"
                }
                width={39}
                height={24}
                alt=""
                onClick={() => handleToggleAll(subscriptions.length === 6)}
                className={styles.toggle}
              />
            </div>
            <div className={styles.bar} />
            <div className={styles.gap}>
              <div className={styles.column}>
                <label className={styles.label}>팔로우 알림</label>
                <Image
                  src={
                    subscriptions.includes("FOLLOW")
                      ? "/icon/noti-option-on.svg"
                      : "/icon/noti-option-off.svg"
                  }
                  width={39}
                  height={24}
                  alt=""
                  onClick={() =>
                    handleToggleSubscription("FOLLOW", subscriptions.includes("FOLLOW"))
                  }
                  className={styles.toggle}
                />
              </div>
              <div className={styles.columnContainer}>
                <p className={styles.topLabel}>그림</p>
                <div className={styles.optionsContainer}>
                  <div className={styles.column}>
                    <label className={styles.label}>좋아요 알림</label>
                    <Image
                      src={
                        subscriptions.includes("FEED_LIKE")
                          ? "/icon/noti-option-on.svg"
                          : "/icon/noti-option-off.svg"
                      }
                      width={39}
                      height={24}
                      alt=""
                      onClick={() =>
                        handleToggleSubscription("FEED_LIKE", subscriptions.includes("FEED_LIKE"))
                      }
                      className={styles.toggle}
                    />
                  </div>
                  <div className={styles.column}>
                    <label className={styles.label}>새 댓글 알림</label>
                    <Image
                      src={
                        subscriptions.includes("FEED_COMMENT")
                          ? "/icon/noti-option-on.svg"
                          : "/icon/noti-option-off.svg"
                      }
                      width={39}
                      height={24}
                      alt=""
                      onClick={() =>
                        handleToggleSubscription(
                          "FEED_COMMENT",
                          subscriptions.includes("FEED_COMMENT")
                        )
                      }
                      className={styles.toggle}
                    />
                  </div>
                  <div className={styles.column}>
                    <label className={styles.label}>새 답글 알림</label>
                    <Image
                      src={
                        subscriptions.includes("FEED_REPLY")
                          ? "/icon/noti-option-on.svg"
                          : "/icon/noti-option-off.svg"
                      }
                      width={39}
                      height={24}
                      alt=""
                      onClick={() =>
                        handleToggleSubscription("FEED_REPLY", subscriptions.includes("FEED_REPLY"))
                      }
                      className={styles.toggle}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.columnContainer}>
                <p className={styles.topLabel}>자유게시판</p>
                <div className={styles.optionsContainer}>
                  <div className={styles.column}>
                    <label className={styles.label}>새 댓글 알림</label>
                    <Image
                      src={
                        subscriptions.includes("POST_COMMENT")
                          ? "/icon/noti-option-on.svg"
                          : "/icon/noti-option-off.svg"
                      }
                      width={39}
                      height={24}
                      alt=""
                      onClick={() =>
                        handleToggleSubscription(
                          "POST_COMMENT",
                          subscriptions.includes("POST_COMMENT")
                        )
                      }
                      className={styles.toggle}
                    />
                  </div>
                  <div className={styles.column}>
                    <label className={styles.label}>새 답글 알림</label>
                    <Image
                      src={
                        subscriptions.includes("POST_REPLY")
                          ? "/icon/noti-option-on.svg"
                          : "/icon/noti-option-off.svg"
                      }
                      width={39}
                      height={24}
                      alt=""
                      onClick={() =>
                        handleToggleSubscription("POST_REPLY", subscriptions.includes("POST_REPLY"))
                      }
                      className={styles.toggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
