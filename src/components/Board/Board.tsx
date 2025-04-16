import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";
import { useDeviceStore } from "@/states/deviceStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import Link from "next/link";
import IconComponent from "../Asset/Icon";

export default function Board() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);

  useIsMobile();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.bar} />
        <BoardAll hasChip={true} />
        {(isMobile || isTablet) && (
          <Link href="/board/write">
            <div className={styles.uploadButton} role="button" tabIndex={0}>
              <IconComponent name="mobileUpload" size={32} isBtn />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
