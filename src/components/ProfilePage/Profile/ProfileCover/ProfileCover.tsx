import IconComponent from "@/components/Asset/Icon";

import { usePreventRightClick } from "@/hooks/usePreventRightClick";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import styles from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover.module.scss";

interface ProfileCoverProps {
  userData: UserData;
  coverImage: string;
  userId: string;
  isMobile: boolean;
  handleAddCover: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteImage: () => void;
}

export default function ProfileCover({
  userData,
  coverImage,
  userId,
  isMobile,
  handleAddCover,
  handleDeleteImage,
}: ProfileCoverProps) {
  const imgRef = usePreventRightClick<HTMLImageElement>();

  if (!userData) return null;

  return (
    <>
      {userData.backgroundImage !== null ? (
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
              <label htmlFor="edit-cover">
                {isMobile ? (
                  <div className={styles.coverEditBtn}>
                    <IconComponent name="editCover" size={14} isBtn />
                  </div>
                ) : (
                  <div className={styles.coverEditBtn}>
                    <IconComponent name="editCover" size={20} isBtn />
                  </div>
                )}
              </label>
              <input
                id="edit-cover"
                type="file"
                accept="image/*"
                className={styles.hidden}
                onChange={handleAddCover}
              />
              <div onClick={handleDeleteImage}>
                {isMobile ? (
                  <div className={styles.coverEditBtn}>
                    <IconComponent name="deleteCover" size={14} isBtn />
                  </div>
                ) : (
                  <div className={styles.coverEditBtn}>
                    <IconComponent name="deleteCover" size={20} isBtn />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.gradientOverlay} />
        </div>
      ) : (
        <div className={styles.backgroundDefaultImageContainer}>
          {userData.id === userId && (
            <>
              <label htmlFor="upload-cover" className={styles.backgroundAddMessage}>
                <IconComponent name="addCover" size={20} />
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
    </>
  );
}
