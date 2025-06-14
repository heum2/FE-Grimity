import Image from "next/image";

import IconComponent from "@/components/Asset/Icon";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";

import styles from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss";
import Icon from "@/components/Asset/IconTemp";
import { useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.profileImageContainer}>
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
          <button type="button" className={styles.addProfileImage} onClick={handleUploadImage}>
            <Icon icon="write" size="xl" />
          </button>
          <input
            ref={inputRef}
            id="upload-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {profileImage !== "/image/default.svg" && (
            <button
              type="button"
              className={styles.deleteImageBtn}
              onClick={handleDeleteProfileImage}
            >
              <Icon icon="close" size="xl" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
