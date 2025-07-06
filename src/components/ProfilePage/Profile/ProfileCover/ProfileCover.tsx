import { usePreventRightClick } from "@/hooks/usePreventRightClick";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import styles from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover.module.scss";
import Icon from "@/components/Asset/IconTemp";
import { useRef } from "react";

interface ProfileCoverProps {
  userData: UserData;
  coverImage: string;
  userId: string;
  handleAddCover: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteImage: () => void;
}

export default function ProfileCover({
  userData,
  coverImage,
  userId,
  handleAddCover,
  handleDeleteImage,
}: ProfileCoverProps) {
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadCover = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  if (!userData) return null;

  return (
    <>
      {userData.backgroundImage ? (
        <div className={styles.backgroundImage}>
          <img
            src={coverImage}
            alt="backgroundImage"
            loading="lazy"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            ref={imgRef}
          />
          {userData.id === userId && (
            <div className={styles.coverBtns}>
              <button type="button" className={styles.coverEditBtn} onClick={handleUploadCover}>
                <Icon icon="pencel" size="xl" />
              </button>
              <button type="button" className={styles.coverEditBtn} onClick={handleDeleteImage}>
                <Icon icon="trash" size="xl" />
              </button>
            </div>
          )}
          <div className={styles.gradientOverlay} />
        </div>
      ) : (
        <div className={styles.backgroundDefaultImageContainer}>
          {userData.id === userId && (
            <>
              <button
                type="button"
                className={styles.backgroundAddMessage}
                onClick={handleUploadCover}
              >
                <Icon icon="plus" size="xl" />
                커버 추가하기
              </button>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAddCover}
        onClick={handleInputClick}
      />
    </>
  );
}
