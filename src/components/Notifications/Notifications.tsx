import { useEffect, useState } from "react";
import { useGetNotifications } from "@/api/notifications/getNotifications";
import IconComponent from "../Asset/Icon";
import Noti from "./Noti/Noti";
import styles from "./Notifications.module.scss";
import { NotificationsProps } from "./Notifications.types";
import { deleteNotifications } from "@/api/notifications/deleteNotifications";
import { putNotifications } from "@/api/notifications/putNotifications";
import { getSubscribe, putSubscribe, SubscriptionType } from "@/api/users/subscribe";
import { useRecoilValue } from "recoil";
import { isMobileState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";

const ALL_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
] as const;

interface NotificationSettingsProps {
  subscriptions: SubscriptionType[];
  onToggleSubscription: (type: SubscriptionType, isSubscribed: boolean) => void;
  onToggleAll: (isSubscribed: boolean) => void;
  onClose: () => void;
  onBack: () => void;
  isMobile: boolean;
}

const NotificationSettings = ({
  subscriptions,
  onToggleSubscription,
  onToggleAll,
  onClose,
  onBack,
  isMobile,
}: NotificationSettingsProps) => (
  <div className={styles.setting}>
    <section className={styles.topSection}>
      {isMobile ? (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>알림 설정</h2>
          <button className={styles.closeButton} onClick={onBack}>
            <IconComponent name="notiClose" width={24} height={24} isBtn padding={8} />
          </button>
        </div>
      ) : (
        <div className={styles.titleContainer}>
          <button className={styles.backButton} onClick={onBack} data-setting-button="true">
            <IconComponent name="notiBack" width={24} height={24} isBtn padding={8} />
          </button>
          <h2 className={styles.title}>알림 설정</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IconComponent name="notiClose" width={24} height={24} isBtn padding={8} />
          </button>
        </div>
      )}
    </section>
    <section className={styles.notiOption}>
      <ToggleOption
        label="모든 알림"
        isEnabled={subscriptions.length === ALL_SUBSCRIPTION_TYPES.length}
        onChange={() => onToggleAll(subscriptions.length === ALL_SUBSCRIPTION_TYPES.length)}
      />
      <div className={styles.bar} />
      <div className={styles.gap}>
        <ToggleOption
          label="팔로우 알림"
          isEnabled={subscriptions.includes("FOLLOW")}
          onChange={() => onToggleSubscription("FOLLOW", subscriptions.includes("FOLLOW"))}
        />
        <NotificationGroup
          title="그림"
          options={[
            {
              type: "FEED_LIKE",
              label: "좋아요 알림",
            },
            {
              type: "FEED_COMMENT",
              label: "새 댓글 알림",
            },
            {
              type: "FEED_REPLY",
              label: "새 답글 알림",
            },
          ]}
          subscriptions={subscriptions}
          onToggle={onToggleSubscription}
        />
        <NotificationGroup
          title="자유게시판"
          options={[
            {
              type: "POST_COMMENT",
              label: "새 댓글 알림",
            },
            {
              type: "POST_REPLY",
              label: "새 답글 알림",
            },
          ]}
          subscriptions={subscriptions}
          onToggle={onToggleSubscription}
        />
      </div>
    </section>
  </div>
);

interface ToggleOptionProps {
  label: string;
  isEnabled: boolean;
  onChange: () => void;
}

const ToggleOption = ({ label, isEnabled, onChange }: ToggleOptionProps) => (
  <div className={styles.column}>
    <label className={styles.label}>{label}</label>
    <img
      src={isEnabled ? "/icon/noti-option-on.svg" : "/icon/noti-option-off.svg"}
      width={39}
      height={24}
      alt=""
      onClick={onChange}
      className={styles.toggle}
      loading="lazy"
    />
  </div>
);

interface NotificationGroupProps {
  title: string;
  options: Array<{
    type: SubscriptionType;
    label: string;
  }>;
  subscriptions: SubscriptionType[];
  onToggle: (type: SubscriptionType, isSubscribed: boolean) => void;
}

const NotificationGroup = ({ title, options, subscriptions, onToggle }: NotificationGroupProps) => (
  <div className={styles.columnContainer}>
    <p className={styles.topLabel}>{title}</p>
    <div className={styles.optionsContainer}>
      {options.map(({ type, label }) => (
        <ToggleOption
          key={type}
          label={label}
          isEnabled={subscriptions.includes(type)}
          onChange={() => onToggle(type, subscriptions.includes(type))}
        />
      ))}
    </div>
  </div>
);

export default function Notifications({ onClose }: NotificationsProps) {
  const { data = [], refetch } = useGetNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const isMobile = useRecoilValue(isMobileState);
  useIsMobile();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscribe();
        setSubscriptions(response.subscription);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleToggleSubscription = async (type: SubscriptionType, isSubscribed: boolean) => {
    try {
      await putSubscribe({ type: isSubscribed ? "ALL" : type });
      setSubscriptions((prev) =>
        isSubscribed ? prev.filter((sub) => sub !== type) : [...prev, type]
      );
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
    }
  };

  const handleToggleAll = async (isSubscribed: boolean) => {
    try {
      await putSubscribe({ type: "ALL" });
      setSubscriptions(isSubscribed ? [] : [...ALL_SUBSCRIPTION_TYPES]);
    } catch (error) {
      console.error("Failed to toggle all subscriptions:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await putNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };

  const sortedNotifications = data
    .sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isRead ? 1 : -1;
    })
    .slice(0, 50);

  const renderNotificationList = () => (
    <div className={styles.notification}>
      <section className={styles.topSection}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>알림</h2>
          <div className={styles.headerBtns}>
            <button
              className={styles.settingButton}
              onClick={() => setIsOpen((prev) => !prev)}
              data-setting-button="true"
            >
              <IconComponent name="notiSetting" width={24} height={24} isBtn padding={8} />
            </button>
            {!isMobile && (
              <button className={styles.closeButton} onClick={onClose}>
                <IconComponent name="notiClose" width={24} height={24} isBtn padding={8} />
              </button>
            )}
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
            <IconComponent name="notiRead" width={16} height={16} isBtn />
            전체 읽음
          </button>
          <button onClick={handleDeleteAllNotifications} className={styles.option}>
            <IconComponent name="notiDeleteAll" width={16} height={16} isBtn />
            전체 삭제
          </button>
        </div>
      )}
    </div>
  );

  const content = !isMobile ? (
    !isOpen ? (
      renderNotificationList()
    ) : (
      <div className={styles.mobileSetting}>
        <NotificationSettings
          subscriptions={subscriptions}
          onToggleSubscription={handleToggleSubscription}
          onToggleAll={handleToggleAll}
          onClose={onClose}
          onBack={() => setIsOpen(false)}
          isMobile={isMobile}
        />
      </div>
    )
  ) : (
    <>
      {renderNotificationList()}
      {isOpen && (
        <div className={styles.mobileSetting}>
          <NotificationSettings
            subscriptions={subscriptions}
            onToggleSubscription={handleToggleSubscription}
            onToggleAll={handleToggleAll}
            onClose={onClose}
            onBack={() => setIsOpen(false)}
            isMobile={isMobile}
          />
        </div>
      )}
    </>
  );

  return <div className={isMobile ? styles.mobileContainer : styles.container}>{content}</div>;
}
