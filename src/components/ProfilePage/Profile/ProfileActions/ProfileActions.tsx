import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Icon from "@/components/Asset/IconTemp";

import styles from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss";

interface ProfileActionsProps {
  isMyProfile: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  handleOpenEditModal: () => void;
  handleUnfollowClick: () => void;
  handleFollowClick: () => void;
  handleShareProfile: () => void;
  handleWithdrawal: () => void;
  handleOpenReportModal: () => void;
  handleBlockClick: () => void;
  handleUnblockClick: () => void;
  handleOpenBlocklistModal: () => void;
}

export default function ProfileActions({
  isMyProfile,
  isFollowing,
  isBlocked,
  isBlocking,
  handleOpenEditModal,
  handleUnfollowClick,
  handleFollowClick,
  handleShareProfile,
  handleWithdrawal,
  handleOpenReportModal,
  handleBlockClick,
  handleUnblockClick,
  handleOpenBlocklistModal,
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

  const blocklistMenuItem = {
    label: "차단 목록",
    onClick: handleOpenBlocklistModal,
  };

  const blockMenuItem = {
    label: isBlocking ? "차단 해제" : "차단하기",
    onClick: isBlocking ? handleUnblockClick : handleBlockClick,
  };

  if (isMyProfile) {
    return (
      <>
        <Button type="outlined-assistive" className={styles.editBtn} onClick={handleOpenEditModal}>
          프로필 편집
        </Button>

        <div className={styles.dropdown}>
          <Dropdown
            {...commonDropdownProps}
            menuItems={[shareMenuItem, blocklistMenuItem, withdrawalMenuItem]}
          />
        </div>
      </>
    );
  }

  if (isBlocked) {
    return (
      <div className={styles.dropdown}>
        <Dropdown
          {...commonDropdownProps}
          menuItems={[shareMenuItem, blockMenuItem, reportMenuItem]}
        />
      </div>
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
          <Dropdown
            {...commonDropdownProps}
            menuItems={[shareMenuItem, blockMenuItem, reportMenuItem]}
          />
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
        <Dropdown
          {...commonDropdownProps}
          menuItems={[shareMenuItem, blockMenuItem, reportMenuItem]}
        />
      </div>
    </>
  );
}
