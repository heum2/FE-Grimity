import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import IconComponent from "@/components/Asset/Icon";

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
      <div className={styles.menuBtn}>
        <IconComponent name="meatball" size={isMobile ? 20 : 16} />
      </div>
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
        <div className={styles.editBtn}>
          <Button
            size={isMobile ? "m" : "l"}
            type="outlined-assistive"
            onClick={handleOpenEditModal}
          >
            프로필 편집
          </Button>
        </div>
        <div className={styles.dropdown}>
          <Dropdown
            {...commonDropdownProps}
            isSide
            menuItems={[shareMenuItem, withdrawalMenuItem]}
          />
        </div>
      </>
    );
  }

  if (isFollowing) {
    return (
      <>
        <div className={styles.followBtn}>
          <Button
            size={isMobile ? "m" : "l"}
            type="outlined-assistive"
            onClick={handleUnfollowClick}
          >
            팔로잉
          </Button>
        </div>
        <div className={styles.dropdown}>
          <Dropdown
            {...commonDropdownProps}
            isTopItem={isMobile}
            isSide={!isMobile}
            menuItems={[shareMenuItem, reportMenuItem]}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.followBtn}>
        <Button size={isMobile ? "m" : "l"} type="filled-primary" onClick={handleFollowClick}>
          팔로우
        </Button>
      </div>
      <div className={styles.dropdown}>
        <Dropdown
          {...commonDropdownProps}
          isTopItem={isMobile}
          isSide={!isMobile}
          menuItems={[shareMenuItem, reportMenuItem]}
        />
      </div>
    </>
  );
}
