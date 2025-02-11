import IconComponent from "@/components/Asset/Icon";
import styles from "./Noti.module.scss";
import { NotiProps } from "./Noti.types";
import { timeAgo } from "@/utils/timeAgo";
import { deleteNotificationsId } from "@/api/notifications/deleteNotifications";
import Image from "next/image";
import { putNotificationsId } from "@/api/notifications/putNotifications";

export default function Noti({ notification, onClose, onRefetch }: NotiProps) {
  const renderMessage = () => {
    switch (notification.data.type) {
      case "FOLLOW":
        return `${notification.data.actor.name}님이 나를 팔로우했어요.`;
      case "FEED_LIKE":
        return `${notification.data.title}에 좋아요가 ${notification.data.likeCount}개 달렸어요.`;
      case "FEED_COMMENT":
        return `${notification.data.actor.name}님이 내 그림에 댓글을 달았어요.`;
      case "FEED_REPLY":
        return `${notification.data.actor.name}님이 내 댓글에 답글을 달았어요.`;
      case "FEED_MENTION":
        return `${notification.data.actor.name}님이 내 답글에 답글을 달았어요.`;
      case "POST_COMMENT":
        return `${notification.data.actor.name}님이 내 게시글에 댓글을 달았어요.`;
      case "POST_REPLY":
        return `${notification.data.actor.name}님이 내 댓글에 답글을 달았어요.`;
      case "POST_MENTION":
        return `${notification.data.actor.name}님이 내 답글에 답글을 달았어요.`;

      default:
        return "";
    }
  };

  const renderImage = () => {
    if (notification.data.type === "FEED_LIKE") {
      return (
        <Image
          src={`https://image.grimity.com/${notification.data.thumbnail}`}
          width={40}
          height={40}
          alt="Thumbnail Image"
          className={styles.thumbnail}
        />
      );
    } else {
      return (
        <Image
          src={
            notification.data.actor.image
              ? `https://image.grimity.com/${notification.data.actor.image}`
              : "/image/default.svg"
          }
          width={40}
          height={40}
          alt="Actor Image"
          className={styles.actorImage}
        />
      );
    }
  };

  const renderId = () => {
    switch (notification.data.type) {
      case "FOLLOW":
        return `/users/${notification.data.actor.id}`;
      case "FEED_LIKE":
      case "FEED_COMMENT":
      case "FEED_REPLY":
      case "FEED_MENTION":
        return `/feeds/${notification.data.feedId}`;
      case "POST_COMMENT":
      case "POST_REPLY":
      case "POST_MENTION":
        return `/posts/${notification.data.postId}`;
      default:
        return "";
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
    await handleReadNotification();
    onClose();
    window.location.href = renderId();
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
        <IconComponent name="notiDelete" width={24} height={24} isBtn padding={8} />
      </div>
    </div>
  );
}
