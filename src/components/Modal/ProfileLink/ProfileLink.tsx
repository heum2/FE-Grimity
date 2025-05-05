import { useDeviceStore } from "@/states/deviceStore";
import styles from "./ProfileLink.module.scss";
import { useIsMobile } from "@/hooks/useIsMobile";
import IconComponent from "@/components/Asset/Icon";

export default function ProfileLink() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 링크</h2>
        </div>
      )}
      <div>
        <IconComponent name="linkInstagram" size={32} isBtn />
        <span>Instagram</span>
        <span>instagram.com/id</span>
      </div>
    </div>
  );
}
