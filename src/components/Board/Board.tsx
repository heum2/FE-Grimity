import BoardPopular from "@/components/Board/BoardPopular/BoardPopular";
import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";
import { useRecoilValue } from "recoil";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import Link from "next/link";
import IconComponent from "../Asset/Icon";

export default function Board() {
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <BoardPopular />
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
