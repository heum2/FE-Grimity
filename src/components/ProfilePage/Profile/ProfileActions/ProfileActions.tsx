import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Icon from "@/components/Asset/IconTemp";

import styles from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss";

interface ProfileActionsProps {
  isMobile: boolean;
  isMyProfile: boolean;
  isFollowing: boolean;
  handleOpenEditModal: () => void;
  handleUnfollowClick: () => void;
  handleFollowClick: () => void;
  handleShareProfile: () => void;
  handleWithdrawal: () => void;
  handleOpenReportModal: () => void;
}

export default function ProfileActions({
  isMobile,
  isMyProfile,
  isFollowing,
  handleOpenEditModal,
  handleUnfollowClick,
  handleFollowClick,
  handleShareProfile,
  handleWithdrawal,
  handleOpenReportModal,
}: ProfileActionsProps) {
  const commonDropdownProps = {
    trigger: (
      <Button size="m" type="outlined-assistive" className={styles.menuBtn}>
        <Icon icon="menu" size="xl" />
      </Button>
    ),
  };

  const shareMenuItem = {
    label: "프로필 공유",
    onClick: handleShareProfile,
  };

  const withdrawalMenuItem = {
    label: "회원 탈퇴",
    onClick: handleWithdrawal,
    isDelete: true,
  };

  const reportMenuItem = {
    label: "신고하기",
    onClick: handleOpenReportModal,
    isDelete: true,
  };

  if (isMyProfile) {
    return (
      <>
        <Button type="outlined-assistive" className={styles.editBtn} onClick={handleOpenEditModal}>
          프로필 편집
        </Button>

        <div className={styles.dropdown}>
          <Dropdown {...commonDropdownProps} menuItems={[shareMenuItem, withdrawalMenuItem]} />
        </div>
      </>
    );
  }

  if (isFollowing) {
    return (
      <>
        <Button
          className={styles.followBtn}
          type="outlined-assistive"
          onClick={handleUnfollowClick}
        >
          팔로잉
        </Button>

        <div className={styles.dropdown}>
          <Dropdown {...commonDropdownProps} menuItems={[shareMenuItem, reportMenuItem]} />
        </div>
      </>
    );
  }

  return (
    <>
      <Button className={styles.followBtn} type="filled-primary" onClick={handleFollowClick}>
        팔로우
      </Button>
      <div className={styles.dropdown}>
        <Dropdown {...commonDropdownProps} menuItems={[shareMenuItem, reportMenuItem]} />
      </div>
    </>
  );
}
