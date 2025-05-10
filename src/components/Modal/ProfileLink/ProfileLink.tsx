import { useDeviceStore } from "@/states/deviceStore";
import styles from "./ProfileLink.module.scss";
import { useIsMobile } from "@/hooks/useIsMobile";
import IconComponent from "@/components/Asset/Icon";
import { useUserDataByUrl } from "@/api/users/getId";
import { useRouter } from "next/router";
import { useClipboard } from "@/utils/copyToClipboard";

export default function ProfileLink() {
  const { copyToClipboard } = useClipboard();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { query } = useRouter();
  const { data: userData } = useUserDataByUrl(query.url as string);
  useIsMobile();

  const getIconName = (linkName: string) => {
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
            <div key={index} className={styles.linkItem}>
              <IconComponent name={iconName} size={32} isBtn />
              <div className={styles.linkInfo}>
                <span className={styles.linkLabel}>{linkName}</span>
                {linkName === "이메일" ? (
                  <span
                    className={styles.link}
                    onClick={() => copyToClipboard(link, "이메일 주소가 복사되었습니다.")}
                  >
                    {link}
                  </span>
                ) : (
                  <a
                    href={link}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link}
                  >
                    {link}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
