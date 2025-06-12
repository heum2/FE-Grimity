import { useModalStore } from "@/states/modalStore";

import IconComponent from "@/components/Asset/Icon";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { formatCurrency } from "@/utils/formatCurrency";
import { useClipboard } from "@/utils/copyToClipboard";

import styles from "@/components/ProfilePage/Profile/ProfileDetails/ProfileDetails.module.scss";

type IconName = "linkInstagram" | "linkX" | "linkYoutube" | "linkPixiv" | "linkMail" | "linkCustom";

const ICON_MAP_KO: Record<string, IconName> = {
  인스타그램: "linkInstagram",
  유튜브: "linkYoutube",
  픽시브: "linkPixiv",
  X: "linkX",
  이메일: "linkMail",
  "직접 입력": "linkCustom",
};

interface ProfileDetailsProps {
  userData: UserData;
  isMyProfile: boolean;
  isMobile: boolean;
  handleOpenFollowerModal: () => void;
  handleOpenFollowingModal: () => void;
}

export default function ProfileDetails({
  userData,
  isMyProfile,
  isMobile,
  handleOpenFollowerModal,
  handleOpenFollowingModal,
}: ProfileDetailsProps) {
  const { copyToClipboard } = useClipboard();
  const openModal = useModalStore((state) => state.openModal);
  const MAX_VISIBLE_LINKS = 3;

  return (
    <div className={styles.leftContainer}>
      <div className={styles.spaceBetween}>
        <div>
          <div className={styles.topContainer}>
            <h2 className={styles.name}>{userData.name}</h2>
          </div>
          {isMyProfile ? (
            <div className={styles.follow}>
              <div className={styles.myfollower} onClick={handleOpenFollowerModal}>
                팔로워
                <p className={styles.followerColor}>{formatCurrency(userData.followerCount)}</p>
              </div>
              <div className={styles.myfollower} onClick={handleOpenFollowingModal}>
                팔로잉
                <p className={styles.followerColor}>{formatCurrency(userData.followingCount)}</p>
              </div>
            </div>
          ) : (
            <div className={styles.follow}>
              <div className={styles.follower}>
                팔로워
                <p className={styles.followerColor}>{formatCurrency(userData.followerCount)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={styles.descriptionContainer}
        style={{
          gap: userData.description && userData.links.length > 0 ? "12px" : "0",
        }}
      >
        {userData.description !== "" && (
          <p className={styles.description}>{userData.description}</p>
        )}
        <div className={styles.linkContainer}>
          {userData.links.slice(0, MAX_VISIBLE_LINKS).map(({ linkName, link }, index) => {
            const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(link);
            const iconName: IconName = isEmail ? "linkMail" : ICON_MAP_KO[linkName] || "linkCustom";

            const displayName = (() => {
              if (isEmail) return link;
              if (linkName === "X") {
                const handleMatch = link.match(/^https?:\/\/(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/i);
                return handleMatch ? `@${handleMatch[1]}` : linkName;
              }
              return linkName;
            })();

            return (
              <div key={index} className={styles.linkWrapper}>
                <IconComponent name={iconName} size={18} />
                {isEmail ? (
                  <span
                    className={styles.link}
                    onClick={() => copyToClipboard(link, "이메일 주소가 복사되었습니다.")}
                  >
                    {displayName}
                  </span>
                ) : (
                  <a href={link} className={styles.link} target="_blank" rel="noopener noreferrer">
                    {displayName}
                  </a>
                )}
                {index === MAX_VISIBLE_LINKS - 1 && userData.links.length > MAX_VISIBLE_LINKS && (
                  <span
                    className={styles.moreLinksText}
                    onClick={() =>
                      openModal({
                        type: "PROFILE-LINK",
                        data: null,
                        isFill: isMobile,
                      })
                    }
                  >
                    외 링크 {userData.links.length - MAX_VISIBLE_LINKS}개
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
