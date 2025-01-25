import Link from "next/link";
import styles from "./Profile.module.scss";
import Button from "../../Button/Button";
import { useMyData } from "@/api/users/getMe";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProfileProps } from "./Profile.types";
import { useUserData } from "@/api/users/getId";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { putFollow } from "@/api/users/putIdFollow";
import { useToast } from "@/utils/useToast";
import { authState } from "@/states/authState";
import IconComponent from "@/components/Asset/Icon";
import { modalState } from "@/states/modalState";
import { useEffect, useState } from "react";
import router from "next/router";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import { useMutation } from "react-query";
import { putProfileImage } from "@/api/users/putMeImage";

export default function Profile({ isMyProfile, id }: ProfileProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const [, setModal] = useRecoilState(modalState);
  const { data: myData } = useMyData();
  const { data: userData, refetch: refetchUserData } = useUserData(id);
  const [profileImage, setProfileImage] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    if (myData) {
      setProfileImage(myData.image || "/image/default.svg");
    }
  }, [myData]);

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleOpenEditModal = () => {
    setModal({ isOpen: true, type: "PROFILE-EDIT", data: null });
  };

  const ImageMutation = useMutation((imageName: string) => putProfileImage(imageName));

  const uploadImageToServer = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
        showToast("JPG, JPEG, PNG 파일만 업로드 가능합니다.", "error");
        return;
      }
      const ext = fileExt as "jpg" | "jpeg" | "png";

      const data = await postPresignedUrl({
        type: "profile",
        ext,
      });

      ImageMutation.mutate(data.imageName);

      const uploadResponse = await fetch(data.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`${uploadResponse.status}`);
      }

      showToast("프로필 사진이 변경되었습니다!", "success");
    } catch (error) {
      showToast("프로필 사진 업로드에 실패했습니다.", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      await uploadImageToServer(file);
    } catch (error) {
      setProfileImage(myData?.image || "/image/default.svg");
      console.error("File change error:", error);
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          {userData.backgroundImage !== "https://image.grimity.com/null" ? (
            <Image
              src={userData.backgroundImage}
              width={70}
              height={70}
              alt="backgroundImage"
              className={styles.backgroundImage}
            />
          ) : (
            <div className={styles.backgroundDefaultImage}>
              <div className={styles.backgroundAddMessage}>
                <IconComponent name="addCover" width={20} height={20} isBtn />
                커버 추가하기
              </div>
            </div>
          )}
          <section
            className={
              userData.backgroundImage !== "https://image.grimity.com/null"
                ? styles.infoContainer
                : styles.infoContainerDefault
            }
          >
            {userData.image !== "https://image.grimity.com/null" ? (
              <div className={styles.profileImageContainer}>
                <Image
                  src={profileImage}
                  width={96}
                  height={96}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
                <label htmlFor="upload-image">
                  <Image
                    src="/icon/edit-profile-image.svg"
                    width={36}
                    height={36}
                    alt="프로필 이미지 수정"
                    className={styles.addProfileImage}
                  />
                </label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  className={styles.hidden}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className={styles.profileImageContainer}>
                <Image
                  src="/image/default.svg"
                  width={96}
                  height={96}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
                <label htmlFor="upload-image">
                  <Image
                    src="/icon/add-profile-image.svg"
                    width={36}
                    height={36}
                    alt="프로필 이미지 추가"
                    className={styles.addProfileImage}
                  />
                </label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  className={styles.hidden}
                  onChange={handleFileChange}
                />
              </div>
            )}
            <div className={styles.spaceBetween}>
              <div className={styles.leftContainer}>
                <div className={styles.topContainer}>
                  <h2 className={styles.name}>{userData.name}</h2>
                </div>
                <div className={styles.follow}>
                  <div className={styles.follower}>
                    팔로워
                    <p className={styles.followerColor}>{formatCurrency(userData.followerCount)}</p>
                  </div>
                  <div className={styles.follower}>
                    팔로잉
                    <p className={styles.followerColor}>
                      {formatCurrency(userData.followingCount)}
                    </p>
                  </div>
                </div>
                <div className={styles.descriptionContainer}>
                  <p className={styles.description}>{userData.description}</p>
                  <div className={styles.linkContainer}>
                    {userData.links.map(({ linkName, link }, index) => (
                      <div key={index} className={styles.linkWrapper}>
                        <IconComponent name="link" width={20} height={20} />
                        <a
                          href={link}
                          className={styles.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {linkName}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.followEdit}>
                {isLoggedIn ? (
                  isMyProfile ? (
                    <Button size="l" type="outlined-assistive" onClick={handleOpenEditModal}>
                      프로필 편집
                    </Button>
                  ) : userData.isFollowing ? (
                    <Button size="l" type="outlined-assistive" onClick={handleUnfollowClick}>
                      언 팔로우
                    </Button>
                  ) : (
                    <Button size="l" type="outlined-assistive" onClick={handleFollowClick}>
                      팔로우
                    </Button>
                  )
                ) : null}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
