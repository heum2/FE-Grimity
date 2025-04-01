import IconComponent from "@/components/Asset/Icon";
import styles from "./Noti.module.scss";
import { NotiProps } from "./Noti.types";
import { timeAgo } from "@/utils/timeAgo";
import { deleteNotificationsId } from "@/api/notifications/deleteNotifications";
import Image from "next/image";
import { putNotificationsId } from "@/api/notifications/putNotifications";
import { useToast } from "@/hooks/useToast";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { isTabletState } from "@/states/isMobileState";
import { imageUrl as imagePrefix } from "@/constants/imageUrl";

export default function Noti({ notification, onClose, onRefetch }: NotiProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const isTablet = useRecoilValue(isTabletState);

  const renderMessage = () => {
    return notification?.message || "";
  };

  const renderImage = () => {
    const imageUrl = notification?.image || "/image/default.svg";
    const isFeedImage = imageUrl.startsWith(`${imagePrefix}/feed`);

    if (isFeedImage) {
      return (
        <img
          src={imageUrl}
          width={isTablet ? 32 : 40}
          height={isTablet ? 32 : 40}
          loading="lazy"
          alt="Thumbnail Image"
          className={styles.thumbnail}
        />
      );
    } else {
      return (
        <Image
          src={imageUrl}
          width={isTablet ? 32 : 40}
          height={isTablet ? 32 : 40}
          quality={50}
          alt="Actor Image"
          className={styles.actorImage}
          unoptimized
        />
      );
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await deleteNotificationsId(notification.id);
      onRefetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleReadNotification = async () => {
    try {
      await putNotificationsId(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      if (!notification.isRead) handleReadNotification();
      router.push(notification.link);
    } catch (error) {
      console.error("Notification error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          showToast("삭제된 게시물입니다.", "warning");
          try {
            await handleDeleteNotification();
            onRefetch();
          } catch (deleteError) {
            console.error("알림 삭제 실패:", deleteError);
          }
        } else {
          showToast("오류가 발생했습니다.", "error");
        }
      }
    } finally {
      onClose();
    }
  };

  return (
    <div className={`${styles.container} ${notification.isRead ? styles.read : ""}`}>
      <div className={styles.content} onClick={handleNotificationClick}>
        {renderImage()}
        <div className={styles.messageWrapper}>
          <span className={styles.message}>{renderMessage()}</span>
          <span className={styles.date}>{timeAgo(notification.createdAt)}</span>
        </div>
      </div>
      <div onClick={handleDeleteNotification}>
        <IconComponent name="notiDelete" size={24} isBtn padding={8} />
      </div>
    </div>
  );
}
