import Image from "next/image";

import IconComponent from "@/components/Asset/Icon";

import { usePreventRightClick } from "@/hooks/usePreventRightClick";

import styles from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss";

interface ProfileImageProps {
  profileImage: string;
  isMobile: boolean;
  isMyProfile: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteProfileImage: () => void;
}

export default function ProfileImage({
  profileImage,
  isMobile,
  isMyProfile,
  handleFileChange,
  handleDeleteProfileImage,
}: ProfileImageProps) {
  const imgRef = usePreventRightClick<HTMLImageElement>();

  return (
    <div className={styles.profileImageContainer}>
      {profileImage && profileImage !== "/image/default.svg" ? (
        <>
          <Image
            src={profileImage}
            width={isMobile ? 80 : 140}
            height={isMobile ? 80 : 140}
            quality={75}
            alt="프로필 이미지"
            className={styles.profileImage}
            unoptimized
            ref={imgRef}
          />
          {isMyProfile && (
            <>
              <label htmlFor="upload-image" className={styles.addProfileImage}>
                <IconComponent name="editProfileImage" size={40} isBtn />
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className={styles.hidden}
                onChange={handleFileChange}
              />
              <div className={styles.deleteImageBtn} onClick={handleDeleteProfileImage}>
                <IconComponent name="deleteProfile" size={40} isBtn />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Image
            src="/image/default.svg"
            width={isMobile ? 80 : 140}
            height={isMobile ? 80 : 140}
            alt="프로필 이미지"
            quality={75}
            className={styles.profileImage}
            unoptimized
            ref={imgRef}
          />
          {isMyProfile && (
            <>
              <label htmlFor="upload-image" className={styles.addProfileImage}>
                <IconComponent name="addProfileImage" size={40} isBtn />
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
        </>
      )}
    </div>
  );
}
