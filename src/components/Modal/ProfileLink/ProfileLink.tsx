import { useDeviceStore } from "@/states/deviceStore";
import styles from "./ProfileLink.module.scss";
import { useIsMobile } from "@/hooks/useIsMobile";
import IconComponent from "@/components/Asset/Icon";
import { useUserDataByUrl } from "@/api/users/getId";
import { useRouter } from "next/router";

export default function ProfileLink() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { query } = useRouter();
  const { data: userData } = useUserDataByUrl(query.url as string);
  useIsMobile();

  const getIconName = (linkName: string, link: string) => {
    const linkType = linkName.toLowerCase();
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(link);

    if (linkType === "instagram") return "linkInstagram";
    if (linkType === "x") return "linkX";
    if (linkType === "youtube") return "linkYoutube";
    if (linkType === "pixiv") return "linkPixiv";
    if (isEmail) return "linkMail";
    return "linkCustom";
  };

  const getDisplayName = (linkName: string, link: string) => {
    const linkType = linkName.toLowerCase();
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(link);

    if (isEmail) return link;
    return link;
  };

  const formatLinkName = (linkName: string) => {
    const linkType = linkName.toLowerCase();
    if (linkType === "instagram") return "Instagram";
    if (linkType === "x") return "X";
    if (linkType === "youtube") return "YouTube";
    if (linkType === "pixiv") return "Pixiv";
    if (linkType === "email") return "Mail";
    return linkName.charAt(0).toUpperCase() + linkName.slice(1);
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
          const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(link);
          const iconName = getIconName(linkName, link);
          const displayName = getDisplayName(linkName, link);

          return (
            <div key={index} className={styles.linkItem}>
              <IconComponent name={iconName} size={32} isBtn />
              <div className={styles.linkInfo}>
                <a
                  href={isEmail ? `mailto:${link}` : link}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.linkLabel}>{formatLinkName(linkName)}</span>
                  {displayName}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
