import Link from "next/link";
import { useRouter } from "next/router";

import { useDeviceStore } from "@/states/deviceStore";

import { useUserDataByUrl } from "@/api/users/getId";

import IconComponent, { IconList } from "@/components/Asset/IconTemp";

import { useClipboard } from "@/utils/copyToClipboard";

import styles from "./ProfileLink.module.scss";

export default function ProfileLink() {
  const { copyToClipboard } = useClipboard();
  const { isMobile } = useDeviceStore();
  const { query } = useRouter();
  const { data: userData } = useUserDataByUrl(query.url as string);

  const getIconName = (linkName: string): IconList => {
    if (linkName === "인스타그램") return "linkInstagram";
    if (linkName === "X") return "linkX";
    if (linkName === "유튜브") return "linkYoutube";
    if (linkName === "픽시브") return "linkPixiv";
    if (linkName === "이메일") return "linkMail";
    return "linkCustom";
  };

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 링크</h2>
        </div>
      )}
      <div className={styles.linksContainer}>
        {userData?.links.map(({ linkName, link }, index) => {
          const iconName = getIconName(linkName);

          return (
            <Link
              title={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (linkName === "이메일") {
                  e.preventDefault();
                  copyToClipboard(link, "이메일 주소가 복사되었습니다.");
                }
              }}
            >
              <div key={index} className={styles.linkItem}>
                <IconComponent icon={iconName} size="3xl" />
                <div className={styles.linkInfo}>
                  <span className={styles.linkLabel}>{linkName}</span>
                  <span className={styles.link}>{link}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
