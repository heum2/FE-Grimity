import styles from "./ProfileCardSkeleton.module.scss";

export default function ProfileCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonProfileSection}>
        <div className={styles.skeletonProfileImage} />
        <div className={styles.skeletonButton} />
      </div>
      <div className={styles.skeletonInfoSection}>
        <div className={styles.skeletonNameRow}>
          <div className={styles.skeletonName} />
          <div className={styles.skeletonFollower} />
        </div>
        <div className={styles.skeletonDescription} />
        <div className={styles.skeletonDescription} />
      </div>
    </div>
  );
}
