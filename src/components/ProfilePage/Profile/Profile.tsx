import { useEffect, useState } from "react";
import router, { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";

import { useMyData } from "@/api/users/getMe";
import { useUserDataByUrl } from "@/api/users/getId";
import { deleteMe } from "@/api/users/deleteMe";

import ProfileActions from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions";
import ProfileCover from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover";
import ProfileImage from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage";
import ProfileDetails from "@/components/ProfilePage/Profile/ProfileDetails/ProfileDetails";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { useFollow } from "@/hooks/useFollow";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useProfileImage } from "@/hooks/useProfileImage";

import { ProfileProps } from "@/components/ProfilePage/Profile/Profile.types";

import styles from "@/components/ProfilePage/Profile/Profile.module.scss";

export default function Profile({ isMyProfile, id, url }: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const openModal = useModalStore((state) => state.openModal);
  const { data: myData } = useMyData();
  const { data: userData, refetch: refetchUserData } = useUserDataByUrl(url);
  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  const { handleFollowClick, handleUnfollowClick } = useFollow(id, refetchUserData);
  const { handleAddCover, handleDeleteImage } = useCoverImage(
    refetchUserData,
    setCoverImage,
    userData,
  );
  const { handleFileChange, handleDeleteProfileImage } = useProfileImage(
    refetchUserData,
    setProfileImage,
    userData?.image || "/image/default.svg",
  );

  const { pathname } = useRouter();
  useEffect(() => {
    refetchUserData();
  }, [pathname]);

  useEffect(() => {
    if (url === myData?.url) {
      setProfileImage(myData.image || "/image/default.svg");
      setCoverImage(myData.backgroundImage || "/image/default-cover.png");
    } else if (url === userData?.id) {
      setProfileImage(userData.image || "/image/default.svg");
      setCoverImage(userData.backgroundImage || "/image/default-cover.png");
    }
  }, [url, myData, userData]);

  useEffect(() => {
    setProfileImage(userData?.image || "/image/default.svg");
    setCoverImage(userData?.backgroundImage || "/image/default-cover.png");
  }, [userData]);

  const handleOpenEditModal = () => {
    openModal({
      type: isMobile ? "PROFILE-EDIT" : "PROFILE-EDIT",
      data: isMobile ? { title: "프로필 편집" } : null,
      isFill: isMobile,
    });
  };

  const handleOpenFollowerModal = () => {
    openModal({ type: "FOLLOWER", data: null, isFill: isMobile });
  };

  const handleOpenFollowingModal = () => {
    openModal({ type: "FOLLOWING", data: null, isFill: isMobile });
  };

  const handleOpenReportModal = () => {
    if (!isLoggedIn) {
      showToast("로그인 후 가능합니다.", "warning");
      return;
    }
    openModal({ type: "REPORT", data: { refType: "USER", refId: userData?.id }, isFill: isMobile });
  };

  const handleWithdrawal = async () => {
    openModal({
      type: null,
      data: {
        title: "정말 탈퇴하시겠어요?",
        subtitle: "계정 복구는 어려워요.",
        confirmBtn: "탈퇴하기",
        onClick: async () => {
          try {
            await deleteMe();
            setAccessToken("");
            setIsLoggedIn(false);
            setUserId("");
            showToast("회원 탈퇴 되었습니다.", "success");
            router.push("/");
          } catch (err) {
            showToast("탈퇴 중 오류가 발생했습니다.", "error");
          }
        },
      },
      isComfirm: true,
    });
  };

  const handleShareProfile = () => {
    openModal({
      type: "SHARE-PROFILE",
      data: { id: userData?.url, name: userData?.name, image: userData?.image },
    });
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          <ProfileCover
            userData={userData}
            coverImage={coverImage}
            userId={user_id}
            handleAddCover={handleAddCover}
            handleDeleteImage={handleDeleteImage}
          />
          <section className={styles.infoContainer}>
            <div className={styles.infoWrapper}>
              <div className={styles.imageLeft}>
                <ProfileImage
                  profileImage={profileImage}
                  isMobile={isMobile}
                  isMyProfile={isMyProfile}
                  handleFileChange={handleFileChange}
                  handleDeleteProfileImage={handleDeleteProfileImage}
                />
                <div className={styles.detailsContainer}>
                  <ProfileDetails
                    userData={userData}
                    isMyProfile={isMyProfile}
                    isMobile={isMobile}
                    handleOpenFollowerModal={handleOpenFollowerModal}
                    handleOpenFollowingModal={handleOpenFollowingModal}
                  >
                    <div className={styles.followEdit}>
                      {isLoggedIn && (
                        <ProfileActions
                          isMobile
                          isMyProfile={isMyProfile}
                          isFollowing={userData.isFollowing}
                          handleOpenEditModal={handleOpenEditModal}
                          handleUnfollowClick={handleUnfollowClick}
                          handleFollowClick={handleFollowClick}
                          handleShareProfile={handleShareProfile}
                          handleWithdrawal={handleWithdrawal}
                          handleOpenReportModal={handleOpenReportModal}
                        />
                      )}
                    </div>
                  </ProfileDetails>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
