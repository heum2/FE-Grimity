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
import { AxiosError } from "axios";
import { deleteMyBackgroundImage } from "@/api/users/deleteMeImage";

export default function Profile({ isMyProfile, id }: ProfileProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const [, setModal] = useRecoilState(modalState);
  const { data: myData } = useMyData();
  const { data: userData, refetch: refetchUserData } = useUserData(id);
  const [, setProfileImage] = useState<string>("");
  const [, setCoverImage] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    if (myData) {
      setProfileImage(myData.image || "/image/default.svg");
      setCoverImage(myData.backgroundImage || "/image/default-cover.png");
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

  const handleAddCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setModal({
        isOpen: true,
        type: "BACKGROUND",
        data: { imageSrc: imageUrl },
      });
    } catch (error) {
      console.error("File change error:", error);
    }
  };

  const deleteImageMutation = useMutation(deleteMyBackgroundImage, {
    onSuccess: () => {
      showToast("커버 이미지가 삭제되었습니다.", "success");
      router.reload();
    },
    onError: (error: AxiosError) => {
      showToast("커버 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
    },
  });

  const handleDeleteImage = () => {
    deleteImageMutation.mutate();
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          {userData.backgroundImage !== "https://image.grimity.com/null" ? (
            <div className={styles.backgroundImage}>
              <Image
                src={userData.backgroundImage}
                alt="backgroundImage"
                width={1400} // 임의 지정
                height={400}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
              {userData.id === user_id && (
                <div className={styles.coverBtns}>
                  <label htmlFor="edit-cover">
                    <div className={styles.coverEditBtn}>
                      <IconComponent name="editCover" width={20} height={20} isBtn />
                      커버 수정하기
                    </div>
                  </label>
                  <input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    className={styles.hidden}
                    onChange={handleAddCover}
                  />
                  <div onClick={handleDeleteImage}>
                    <Button
                      type="outlined-assistive"
                      size="m"
                      leftIcon={<IconComponent name="deleteCover" width={20} height={20} isBtn />}
                    >
                      커버 삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.backgroundDefaultImageContainer}>
              <Image
                src="/image/default-cover.png"
                width={1400} // 임의 지정
                height={264}
                alt="backgroundImage"
                style={{
                  width: "100%",
                  height: "264px",
                  objectFit: "cover",
                }}
              />
              {userData.id === user_id && (
                <>
                  <label htmlFor="upload-cover" className={styles.backgroundAddMessage}>
                    <Image src="/icon/add-cover.svg" width={20} height={20} alt="커버 추가하기" />
                    커버 추가하기
                  </label>
                  <input
                    id="upload-cover"
                    type="file"
                    accept="image/*"
                    className={styles.hidden}
                    onChange={handleAddCover}
                  />
                </>
              )}
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
                  src={userData.image}
                  width={140}
                  height={140}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
                {userData.id === user_id && (
                  <>
                    <label htmlFor="upload-image">
                      <Image
                        src="/icon/edit-profile-image.svg"
                        width={40}
                        height={40}
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
                  </>
                )}
              </div>
            ) : (
              <div className={styles.profileImageContainer}>
                <Image
                  src="/image/default.svg"
                  width={140}
                  height={140}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
                {userData.id === user_id && (
                  <>
                    <label htmlFor="upload-image">
                      <Image
                        src="/icon/add-profile-image.svg"
                        width={40}
                        height={40}
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
                  </>
                )}
              </div>
            )}
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
                  <p className={styles.followerColor}>{formatCurrency(userData.followingCount)}</p>
                </div>
              </div>
              <div className={styles.descriptionContainer}>
                {userData.description !== "" && (
                  <p className={styles.description}>{userData.description}</p>
                )}
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
              <div className={styles.followEdit}>
                {isLoggedIn ? (
                  isMyProfile ? (
                    <Button size="l" type="outlined-assistive" onClick={handleOpenEditModal}>
                      프로필 편집
                    </Button>
                  ) : userData.isFollowing ? (
                    <Button size="l" type="outlined-assistive" onClick={handleUnfollowClick}>
                      팔로잉
                    </Button>
                  ) : (
                    <Button size="l" type="filled-primary" onClick={handleFollowClick}>
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
